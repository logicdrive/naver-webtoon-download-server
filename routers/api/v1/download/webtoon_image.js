import express from "express"

const router = express.Router()


router.post('/', (req, res) => {
    res.send('[MOCK] 웹툰 이미지에 대한 zip 파일을 다운로드 시킴')
})


export default router