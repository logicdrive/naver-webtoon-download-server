import express from "express"

const router = express.Router()


router.post('/', (req, res) => {
    res.send('[MOCK] 웹툰명 검색 결과를 반환시킴')
})


export default router