const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { getNextCustomId } = require('../utils/utility');

const userSchema = new mongoose.Schema(
  {
    customId: {
      type: Number,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [
        80,
        'you reach to character limits, please use a shorter name',
      ],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'this email is  not valid'],
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      small: { type: String, default: 'public/img/userNoImage-small.jpg' },
      medium: { type: String, default: 'public/img/userNoImage-medium.jpg' },
      large: { type: String, default: 'public/img/userNoImage-large.jpg' },
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'siteAdmin'],
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'please enter a password'],
      minlength: [8, 'passsword should contain at least 8 character'],
      select: false,
    },
    confPassword: {
      type: String,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: ' Passwords Does Not Matched',
      },
    },
    phoneNumber: {
      type: String,
      maxlength: 13,
    },
    signUpAt: {
      type: Date,
      default: Date.now(),
    },
    passwordResetToken: String,
    passwordResetExp: Date,
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// hashing password
//hashing password
userSchema.pre('save', async function (next) {
  try {
    //execute if password modified
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    //delete confpassword
    this.confPassword = undefined;
    next();
  } catch (e) {
    return next(e);
  }
});
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.customId = await getNextCustomId(this.constructor);
  }
  next();
});

//adding chaged password date
userSchema.pre('save', function (next) {
  if (!this.isModified || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//excepting deactivated users on find queries
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// method middleware to check if password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  try {
    return await bcrypt.compare(candidatePassword, userPassword);
  } catch (error) {
    throw new Error(error);
  }
};

//checking jwt time Stamp and changed password time
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  //  NOT changed
  return false;
};

//create token for changing password
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExp = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
