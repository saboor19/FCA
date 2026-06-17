const generateAttendanceCode = () => {

  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "ATT-";

  for(let i=0;i<4;i++){

    code += chars.charAt(
      Math.floor(
        Math.random() * chars.length
      )
    );

  }

  return code;

};

module.exports =
generateAttendanceCode;