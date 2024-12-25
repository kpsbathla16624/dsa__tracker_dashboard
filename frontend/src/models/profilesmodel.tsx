import User from "./userModel";

export default interface userprops {
    profiles: {
      codeChef: any;
      codeForces: any;
      leetCode: any;
    };
  }

  export interface userProps {
    user: User;
  }
  