import runQuery from "./dbConnection.js";

const sendNotification = async (id) => {
  const queryData = `INSERT INTO notifications (action,user_id) VALUES (?,?)`;
  const query = await runQuery(queryData, ["pending", id]);
  return query;
};

const insertUserToTable = async (values) => {
  const {
    full_name,
    email,
    role,
    address,
    avatar,
    current_school,
    previous_school,
    experience,
    expertise,
    parents_name,
    assigned_teacher,
  } = values;

  if (role == "admin") return;

  const queryValues = [
    full_name,
    email,
    role == "student" ? "student" : "teacher",
    address,
    avatar,
    current_school,
    previous_school,
    role == "student" && parents_name,
    role == "student" ? assigned_teacher : 1,
    role == "teacher" && experience,
    role == "teacher" && expertise,
    false,
  ];

  const queryData = `INSERT INTO user 
    (full_name,email,role,address,avatar,current_school,previous_school,parents_name,assigned_teacher,experience,expertise,is_approved) 
  values (?,?,?,?,?,?,?,?,?,?,?,?)`;

  const query = await runQuery(queryData, queryValues);

  if (query) {
    const newUser = await runQuery("SELECT * FROM user WHERE email=?", [email]);
    sendNotification(newUser[0].id);
    return newUser[0];
  }

  return query;
};

const getUser = async (name, email, role) => {
  console.log("Getting user with : ", name, email, role);
  const query = runQuery(
    "SELECT * FROM user WHERE full_name=? AND email=? AND role=?",
    [name, email, role]
  );
  return query;
};

const deleteUser = async (id) => {
  const queryData = `DELETE FROM user WHERE id=?`;
  const queryValues = [id];
  return await runQuery(queryData, queryValues);
};

const processUserRequest = (notification_id, isApproved) => {
  const query = runQuery(
    "UPDATE user SET is_approved = ? WHERE id = (SELECT user_id FROM notifications WHERE id = ?)",
    [isApproved, notification_id]
  );
  return query;
};

const updateUser = async (email, id) => {
  const queryValues = [email, id];
  const queryData = `UPDATE SET user email=? WHERE id=?`;
  return await runQuery(queryData, queryValues);
};

export {
  insertUserToTable,
  getUser,
  processUserRequest,
  deleteUser,
  updateUser,
  sendNotification,
};
