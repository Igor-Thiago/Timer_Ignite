import { createContext, ReactNode, useReducer, useState } from "react";

interface CreateCycleData{
    task: string
    minutesAmount: number
}

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
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

interface CyclesState {
    cycles: Cycle[]
    activeCycleId: string | null

}

export function CyclesContextProvider({children}: CyclesContextProviderProps) {
    const [cyclesState, dispatch] = useReducer((state: CyclesState, action: any) => {
        
        /* O reducer serve para diminuir a complexidade de um useState por exemplo, 
        no lugar da função set diferente do useState temos o dispatch. e os parametros da
        função reducer são primeiro o estado "state" e depois uma action que pode fazer qualquer 
        ação no estado */

        switch(action.type) {
            case 'ADICIONA_NOVO_CICLO':
                return {
                    ...state,
                    cycles: [...state.cycles, action.payload.newCycle],
                    activeCycleId: action.payload.newCycle.id,
                }

            case 'INTERROMPE_CICLO_ATIVO':
                return {
                    ...state,
                    cycles: state.cycles.map((cycle) => {
                        if (cycle.id == state.activeCycleId) {
                            return { ...cycle, interruptedDate: new Date()}   
                        } else {
                            return cycle
                        }
                        }),
                    activeCycleId: null,
                }

            case 'MARK_CURRENT_CYCLE_AS_FINISHED':
                return {
                    ...state,
                    cycles: state.cycles.map((cycle) => {
                        if (cycle.id == state.activeCycleId) {
                            return { ...cycle, finishedDate: new Date()}   
                        } else {
                            return cycle
                        }
                        }),
                    activeCycleId: null,
                }

            default:
                return state
        }
    },
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
        
            dispatch({
                type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
                payload: {
                    activeCycleId,
                },
            })

    }

    function createNewCycle(data: CreateCycleData){
        const id = String(new Date().getTime())
        
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }



        dispatch({
            type: 'ADICIONA_NOVO_CICLO',
            payload: {
                newCycle,
            },
        })

        
        setAmountSecondsPassed(0)
        

    }

    function interruptCurrentCycle() {
        
        // Aqui primeiro eu altero o ciclo ativo para falar a data que ele foi interrompido
        // e depois eu falo que não tenho mais nenhum ciclo ativo

      

        dispatch({
            type: 'INTERROMPE_CICLO_ATIVO',
            payload: {
                activeCycleId,
            },

        })
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