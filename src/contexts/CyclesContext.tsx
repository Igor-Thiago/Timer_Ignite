import { createContext, ReactNode, useReducer, useState } from "react";
import { Cycle, cycleReducer } from "../reducers/cycles/reducers";
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";

interface CreateCycleData{
    task: string
    minutesAmount: number
}




interface CyclesContextType{
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}



export function CyclesContextProvider({children}: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer( cycleReducer,
    
    {
        cycles: [],
        activeCycleId: null,
    })

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
    
    
    const { cycles, activeCycleId} = cyclesState

   

    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)


    function setSecondsPassed(seconds: number){
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {  // Essa função serve para armazenar o setCycles pois a tipagem dele é zuada
        
            dispatch(markCurrentCycleAsFinishedAction())

    }

    function createNewCycle(data: CreateCycleData){
        const id = String(new Date().getTime())
        
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }



        dispatch(addNewCycleAction(newCycle))

        
        setAmountSecondsPassed(0)
        

    }

    function interruptCurrentCycle() {
        
        // Aqui primeiro eu altero o ciclo ativo para falar a data que ele foi interrompido
        // e depois eu falo que não tenho mais nenhum ciclo ativo

        dispatch(interruptCurrentCycleAction())
    }

    return(
        <CyclesContext.Provider 
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
                }}
        >  
            {children}
        </CyclesContext.Provider>  
       
    )
}