
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, "Must have a valid email address"]
    },
       password: {
      type: String,
      required: function () {
        
        return !this.githubId;
      },
    },
    // githubId: {
    //   type: String,
    //   unique: true,
    //   sparse: true, // Allows multiple nulls for testins purposes.
    // },
  },
{ timestamps: true });


//=======* Hash User Password with this function *=======

userSchema.pre('save', async function(next){
    if(this.password && (this.isNew || this.isModified('password'))){
        const saltRounds = 8;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next();
});

//=======* This method will validate the password *=======

userSchema.methods.matchPassword = async function(password) {
    return this.password ? bcrypt.compare(password, this.password):false;

};

const User = mongoose.model('User', userSchema);

export default User