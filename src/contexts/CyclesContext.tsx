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

export function CyclesContextProvider({children}: CyclesContextProviderProps) {
    const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
        
        /* O reducer serve para diminuir a complexidade de um useState por exemplo, 
        no lugar da função set diferente do useState temos o dispatch. e os parametros da
        função reducer são primeiro o estado "state" e depois uma action que pode fazer qualquer 
        ação no estado */
        
        if(action.type == 'ADICIONA_NOVO_CICLO'){
            return [...state, action.payload.newCycle]
        }
        
        return state
    }, [])


    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)


    function setSecondsPassed(seconds: number){
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {  // Essa função serve para armazenar o setCycles pois a tipagem dele é zuada
        /* setCycles( (state) =>
            state.map((cycle) => {
            if (cycle.id == activeCycleId) {
                return { ...cycle, finishedDate: new Date()}   
            } else {
                return cycle
            }
            }),
        ) */
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

        //setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassed(0)
        

    }

    function interruptCurrentCycle() {
        
        // Aqui primeiro eu altero o ciclo ativo para falar a data que ele foi interrompido
        // e depois eu falo que não tenho mais nenhum ciclo ativo

       /*  setCycles((state) =>
            state.map((cycle) => {
            if (cycle.id == activeCycleId) {
                return { ...cycle, interruptedDate: new Date()}   
            } else {
                return cycle
            }
            }),
        )
        setActiveCycleId(null) */


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