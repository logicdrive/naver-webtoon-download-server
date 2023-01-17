import express from "express"

const router = express.Router()


router.post('/', (req, res) => {
    res.send('[MOCK] 특정 웹툰에 대한 목차 목록을 반환시킴')
})


export default router