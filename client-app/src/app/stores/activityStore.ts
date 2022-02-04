import {  makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuidv4} from 'uuid';
export default class ActivityStore
{
   activityRegister=new Map<string,Activity>();
   selectedActivity:Activity|undefined=undefined;
   editMode=false;
   loading=false;
   loadingInitial=true;


    constructor()
    {
        makeAutoObservable(this)
    }
    get activitiesByDate()
    {
        return Array.from(this.activityRegister.values()).sort((a,b)=>
            Date.parse(a.date)-Date.parse(b.date));
    }
    loadActivities=async ()=>{
        this.loadingInitial=true;
        try
        {
            const activities=await agent.Activities.list();
          
                activities.forEach(activity=>{
                    activity.date=activity.date.split('T')[0]
                    this.activityRegister.set(activity.id,activity);
                  });
                
            this.setLoadingInitial(false);

        }catch(error)
        {
            this.setLoadingInitial(false);
            console.log(error);
        }
    }
   setLoadingInitial=(state:boolean)=>{
       this.loadingInitial=state;
   }
   selectActivity=(id:string)=>
   {
       this.selectedActivity=this.activityRegister.get(id);
   }
   cancelSelectedActivity=()=>
   {
      this.selectedActivity=undefined;
   }
   openForm=(id?:string)=>{
     id?this.selectActivity(id):this.cancelSelectedActivity();
     this.editMode=true;
   }
   closeForm=()=>
   {
       this.editMode=false;
   }
   createActivity=async(activity:Activity)=>{
       this.loading=true;
       activity.id=uuidv4();
       try
       {
           await agent.Activities.create(activity);
           runInAction(()=>{
            this.activityRegister.set(activity.id,activity);
               this.selectedActivity=activity;
               this.editMode=false;
               this.loading=false;
           })

       }catch(error)
       {
           console.log(error);
           runInAction(()=>{
            this.loading=false;
        })
       }

   }
   updateActivity=async (activity:Activity)=>{
       this.loading=true;
       try{
           await agent.Activities.update(activity);
           runInAction(()=>{
               //spread operatoru kullanılarak  diziyi değiştirirken aynı zamanda yeni diziyi oluşturabilriz.
           this.activityRegister.set(activity.id,activity);
           this.selectedActivity=activity;
           this.editMode=false;
           this.loading=false;
           })

       }catch(error)
       {
           console.log(error);
           runInAction(()=>{
            this.loading=false;
        })
       }
   }
   deleteActivity=async(id:string)=>{
       this.loading=true;
       try
       {
           await agent.Activities.delete(id);
           runInAction(()=>{
            this.activityRegister.delete(id);
            if(this.selectedActivity?.id===id) this.cancelSelectedActivity();
            this.loading=false;
           })

       }catch(error)
       {
          console.log(error);
          runInAction(()=>{
            this.loading=false;
        })
       }
   }
}