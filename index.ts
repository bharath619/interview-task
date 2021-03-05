import Express from "express"
import Queue from "bee-queue";
import {initDB,getDB} from "./DB";
import {urlencoded} from "body-parser";
const userQueue = new Queue("user_queue",{
    redis:{
        host:"127.0.0.1",
        port:6380,
        
    },
    removeOnSuccess:true,
})
interface User{
    name:string,
    age:Number,
    location:string
}
async function addToQueue(user:User):Promise<void>{
    const jobs = userQueue.createJob(user).retries(2)
    await jobs.save();
    
}
const app = Express()
app.set("view engine","ejs")
app.use(urlencoded())
app.get("/",function(_,res){
    res.render("index",{title:"Add To Queue"})
})
app.post("/",async function(req,res){
   await addToQueue(req.body as User)
   res.render("index",{title:"Add To Queue"})
})
userQueue.process(async function(job:Queue.Job<User>,done:any){
    console.log("new job...")
   getDB().db("users").collection("users").insertOne(job.data).then(_=>{
       done(null)
   }).catch(err=>{
       done(err)
   })
})
initDB(function(err:any){
    if(err){
        process.exit(0)
    }
    app.listen(8000,function(){
        console.log("sever listening on port :8000...")
    })
})
