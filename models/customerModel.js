const mongoose = require('mongoose');
const argon2 = require('argon2');
const validator = require('validator');
const crypto = require('crypto');

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      fa: {
        type: String,
        required: true,
        trim: true,
        maxlength: [
          80,
          'you reach to character limits, please use a shorter name',
        ],
      },
      en: { type: String },
    },
    lastName: {
      fa: {
        type: String,
        required: true,
        trim: true,
      },
      en: { type: String },
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
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['customer', 'user'],
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
      required: [true, 'please enter password again'],
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

const argon2Options = {
  saltLength: 16,
  timeCost: 1,
  memoryCost: 8192,
  parallelism: 1,
  type: argon2.argon2id,
};

// hashing password
customerSchema.pre('save', async function (next) {
  //excute if password modified
  try {
    if (!this.isModified('password')) return next();

    const salt = await argon2.generateSalt(argon2Options.saltLength);
    const hashedPassword = await argon2.hash(this.password, {
      salt,
      ...argon2Options,
    });
    this.password = hashedPassword;
    //delete confpassword
    this.confPassword = undefined;
    next();
  } catch (e) {
    return next(e);
  }
});

//adding chaged password date
customerSchema.pre('save', function (next) {
  if (!this.isModified || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//excepting deactivated users on find queries
customerSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

customerSchema.pre('save', async function (next) {
  if (!this.name) {
    return next(new Error('Name is required.'));
  }

  const [firstName, ...lastName] = this.name.split(' ');

  this.firstName = firstName;
  this.lastName = lastName.join(' ');

  next();
});

// method middleware to check if password is correct
customerSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  try {
    return await argon2.verify(candidatePassword, userPassword);
  } catch (error) {
    throw new Error(error);
  }
};

//checking jwt time Stamp and changed password time
customerSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
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
customerSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExp = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
