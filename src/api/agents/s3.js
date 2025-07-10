const { pipeline } = require("stream");
const { promisify } = require("util");

const services = require("../../services/aws-s3")

const S3 = module.exports

S3.get = async (req) => {
    try {
        
        const asin = req.params.asin
        console.log("params --->",asin)
        const key = `report/${asin}.json`

        const response = await services.getJson(key);
        return response;

    } catch (error) {
        throw new Error(error)
    }
}

S3.put = async(req)=>{
        try{
        const asin = req.params.asin
        const data = req.body.data         // data == file , brand
        const key = `report/${asin}.json`  // file path confirm it 

        const response = await services.saveJson(key,data);
        return response;

    }catch(error){
        throw new Error(error)
    }
}

S3.download = async (req, res) => {
    try {
        // console.log("req.params.asin --->",req.params.asin)
        const asin = req.params.asin
        const brand = req.params.brand
        const date = req.params.date
        if (!asin) {
            throw new Error("Asin not found");

        }

        // /report/download/:brand/:asin/:date",

        // const path = "pdp_audit/MILTON/B0C74Q9QV6/2025-06-19/audit_report.pdf"
        // path of the s3
        const path = `pdp_audit/${brand}/${asin}/${date}/audit_report.pdf`
        
        const report = await services.getJson(path);
        
        const format = "pdf"

        res.setHeader("Content-Disposition", `attachment; filename="${asin}.${format}"`);
        res.setHeader("Content-Type","application/pdf"); // "application/pdf" :

        const streamPipeline = promisify(pipeline);
        // // res.attachment
        const data =  await streamPipeline(report, res);
        
        // no need set response after setHeader is set == throw error
       
        return report;
    } catch(err) {

        if (err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404) {
            return res.status(404).json({ error: "Report not found" });
        }
        console.log("error while downloading the file -->",err)
        return res.status(500).json({
            success:false,
            message:"Not able to downloaded",
            
        })

        
    }
}