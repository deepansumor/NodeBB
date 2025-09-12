const { authorization } = require("../../services");
const { fetchCatalogData ,getAsinData} = require("../../services/spapi");


const spapi = module.exports

spapi.asinData = async(req)=>{
    try{ 
        // const asin = req.params.asin

        console.log("I am inside the asinData api --> 11")

        const data = await getAsinData()

        return data;

    }catch(error){
        throw new Error("Error while getting the asin data -->",error);
        
    }
}

spapi.authStart = async(req,res)=>{
    try{

        await authorization.startAuth(req,res);

    }catch(error){
        console.log("Error in the authorization -->",error)
        throw new Error("Error while the authorization");
        
    }
}

spapi.authFinish = async(req,res)=>{
    try{

        await authorization.finishAuth(req,res);

    }catch(error){
        console.log("Error in the authorization -->",error)
        throw new Error("Error while the authorization");
        
    }
}

spapi.authStart = async(req,res)=>{
    try{

        await authorization.startAuth(req,res);

    }catch(error){
        console.log("Error in the authorization -->",error)
        throw new Error("Error while the authorization");
        
    }
}

spapi.authFinish = async(req,res)=>{
    try{

        await authorization.finishAuth(req,res);

    }catch(error){
        console.log("Error in the authorization -->",error)
        throw new Error("Error while the authorization");
        
    }
}