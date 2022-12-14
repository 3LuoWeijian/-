// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection("leave")
    .add({
      data: {

        stu_name: event.stu_name,
        sno: event.sno,
        class: event.class,
        academy: event.academy,

        pass_fdy: event.pass_fdy,
        pass_xsc: event.pass_xsc,
        pass_xy: event.pass_xy,
        
        rejectedState: event.rejectedState,
        
        check_fdy: event.check_fdy,
        check_xy: event.check_xy,
        check_xsc: event.check_xsc,

        leaveClass: event.leaveClass,
        region: event.region,
        leaveDate: event.leaveDate,
        leaveReason: event.leaveReason,
        returnDate: event.returnDate,
        contactName: event.contactName,
        contactPhone: event.contactPhone,
        submitTime: event.submitTime,
        stu_type: event.stu_type,
        campusClass: event.campusClass,
        newImgList: event.newImgList,
        riskRegion: event.riskRegion,
        fdy_name: event.fdy_name,
      
        
      }
    })
}