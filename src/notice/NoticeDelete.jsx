const NoticeDelete = async () => {
  await fetch(
    "/api/noticeDelete",
    {
      noticeNo: noticeNo
    },
    {
      headers: { Bearer: "토큰값" },
    }
  );
};

export default NoticeDelete;
