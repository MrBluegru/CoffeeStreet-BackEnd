const { Router } = require("express");
const {  changeStatus } = require("../controllers/order");

const router = Router();


router.put("/:id/change-status", changeStatus);


module.exports = router;
