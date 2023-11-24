// import jwt from "jsonwebtoken";
import Mock from "../mock";

// const JWT_SECRET = "jwt_secret_key";
// const JWT_VALIDITY = "7 days";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiYWdlIjoyNSwicm9sZSI6IkFETUlOIiwibmFtZSI6Ikphc29uIEFsZXhhbmRlciIsImVtYWlsIjoiamFzb25AdWktbGliLmNvbSIsInVzZXJuYW1lIjoiamFzb25fYWxleGFuZGVyIiwiYXZhdGFyIjoiL2Fzc2V0cy9pbWFnZXMvZmFjZS02LmpwZyJ9.BILDCjrPpk2ohysHiWScnVvEoxI6UpH1vBmS59KjiNo";

const userList = [
  {
    id: 1,
    age: 25,
    role: "ADMIN",
    name: "Jason Alexander",
    email: "jason@ui-lib.com",
    username: "jason_alexander",
    avatar: "/assets/images/face-6.jpg",
  },
];

// FOLLOWING CODES ARE MOCK SERVER IMPLEMENTATION
// YOU NEED TO BUILD YOUR OWN SERVER
// IF YOU NEED HELP ABOUT SERVER SIDE IMPLEMENTATION
// CONTACT US AT support@ui-lib.com

Mock.onPost("/api/auth/login").reply(async (config) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const { email } = JSON.parse(config.data);
    const user = userList.find((u) => u.email === email);

    if (!user) {
      return [400, { message: "Invalid email or password" }];
    }

    // const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
    //   expiresIn: JWT_VALIDITY,
    // });

    return [
      200,
      {
        accessToken: token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
          avatar: user.avatar,
        },

        // user: userList[0],
      },
    ];
  } catch (err) {
    console.error(err);
    return [500, { message: "Internal server error" }];
  }
});

Mock.onPost("/api/auth/register").reply((config) => {
  try {
    const { email, username } = JSON.parse(config.data);
    const user = userList.find((u) => u.email === email);

    if (user) {
      return [400, { message: "User already exists!" }];
    }

    const newUser = {
      id: 2,
      age: 25,
      email: email,
      role: "GUEST",
      name: "Guest User",
      username: username,
      avatar: "/assets/images/face-6.jpg",
    };

    userList.push(newUser);

    // const accessToken = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
    //   expiresIn: JWT_VALIDITY,
    // });

    return [
      200,
      {
        accessToken: token,
        user: {
          id: newUser.id,
          role: newUser.role,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          username: newUser.username,
        },
      },
    ];
  } catch (err) {
    console.error(err);
    return [500, { message: "Internal server error" }];
  }
});

Mock.onGet("/api/auth/profile").reply((config) => {
  try {
    const { Authorization } = config.headers;

    if (!Authorization) {
      return [401, { message: "Invalid Authorization token" }];
    }

    // const accessToken = Authorization.split(" ")[1];
    // const { userId } = jwt.verify(accessToken, JWT_SECRET);
    // const user = userList.find((u) => u.id === userId);

    // if (!user) {
    //   return [401, { message: "Invalid authorization token" }];
    // }

    return [
      200,
      {
        // user: {
        //   id: user.id,
        //   name: user.name,
        //   role: user.role,
        //   email: user.email,
        //   avatar: user.avatar,
        // },
        user: userList[0],
      },
    ];
  } catch (err) {
    console.error(err);
    return [500, { message: "Internal server error" }];
  }
});
