import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import bundler from "../../../bundler/bundler";
import { Serializable } from "worker_threads";
export const bundleAction = createAsyncThunk("bundleReducer/bundle",async (inp:{id:string,code:string})=>{
    const {id,code} = inp;
    try{
        const data = await bundler(code);
        // console.log(data);
        return {code:data.outputFiles[0].text,id};
    }catch(e:any){
        return { bundleError: e.errors[0],id }
    }
        //   if (iframeRef.current?.contentWindow) {
        //     iframeRef.current.contentWindow.postMessage(
        //       { code: data.outputFiles[0].text },
        //       "*"
        //     );
        //   }
        // }

})


export interface BundleState {
    [key:string]:{
        loading: boolean;
        error: string | Serializable | null;
        code: string;
    }
}

const initialState : BundleState = {}

export const bundleSlice = createSlice({
    name: "bundleReducer",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(bundleAction.pending, (state,action:any) => {
            console.log(action,"bundleAction")
            if(!state[action.meta.arg.id]){
                state[action.meta.arg.id] = {
                    loading: true,
                    error: null,
                    code: "",
                }
            }
            state[action.meta.arg.id].loading = true;
            state[action.meta.arg.id].error = null;
            state[action.meta.arg.id].code = "";

        });
        builder.addCase(bundleAction.fulfilled, (state, action) => {
            console.log(action,"bundleActionDone")
            if(!state[action.payload.id]){
                state[action.payload.id] = {
                    loading:false,
                    error:null,
                    code:""
                }
            }
            state[action.payload.id].loading = false;
            if(action.payload.bundleError){
                state[action.payload.id].error = action.payload.bundleError;
                state[action.payload.id].code = "";
            }
            else{
                state[action.payload.id].error = null;
                state[action.payload.id].code = action.payload.code!;
            }
        });
    }
});

export default bundleSlice.reducer;
