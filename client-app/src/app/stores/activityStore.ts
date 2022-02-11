import {  makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
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

    get groupedActivities()
    {
        return Object.entries(
        this.activitiesByDate.reduce((activities,activity)=>{
            const date=activity.date;
            activities[date]= activities[date]?[...activities[date],activity]:[activity];
            return activities;
         },{} as {[key:string]:Activity[]})
        )
    }
    loadActivities=async ()=>{
        this.loadingInitial=true;
        try
        {
            const activities=await agent.Activities.list();
          
                activities.forEach(activity=>{
                    this.setActivity(activity);
                  });
                
            this.setLoadingInitial(false);

        }catch(error)
        {
            this.setLoadingInitial(false);
            console.log(error);
        }
    }
loadActivity=async(id:string)=>
{
    let activity=this.getActivity(id);

    if(activity)
    {
      this.selectedActivity=activity;
      return activity;
    }else{
      this.loadingInitial=true;
      try{
        activity=await agent.Activities.details(id);
        this.setActivity(activity);
        runInAction(()=>{
            this.selectedActivity=activity;
        })
       
        this.setLoadingInitial(false);
        return activity;
      }catch(error)
      {
        console.log(error);
        this.setLoadingInitial(false);
      }
    }
}

private getActivity=(id:string)=>
{
   return this.activityRegister.get(id);
}
private setActivity=(activity:Activity)=>
{
    activity.date=activity.date.split('T')[0]
    this.activityRegister.set(activity.id,activity);
}

   setLoadingInitial=(state:boolean)=>{
       this.loadingInitial=state;
   }
   createActivity=async(activity:Activity)=>{
       this.loading=true;
      
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