import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountDownButton, StopCountDownButton } from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod'
import { createContext, useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { NewCycleForm } from "./components/NewCycleForm";
import { CountDown } from "./components/Countdown";




// esse tipo aqui acima serve para substituir uma interface. Ele pega a tipagem da task e do minutesAmount por eu já ter declarado
// no newCycleFormValidationSchema por meio do schema que é a validação em si

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

interface CyclesContextType{
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    markCurrentCycleAsFinished: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home(){

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    




    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)


    function markCurrentCycleAsFinished() {  // Essa função serve para armazenar o setCycles pois a tipagem dele é zuada
        setCycles( (state) =>
            state.map((cycle) => {
            if (cycle.id == activeCycleId) {
                return { ...cycle, finishedDate: new Date()}   
            } else {
                return cycle
            }
            }),
        )
    }

    function handleCreateNewCycle(data: NewCycleFormData){
        const id = String(new Date().getTime())
        
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassed(0)
        reset()

    }

    function handleInterruptCycle() {
        
        // Aqui primeiro eu altero o ciclo ativo para falar a data que ele foi interrompido
        // e depois eu falo que não tenho mais nenhum ciclo ativo

        setCycles((state) =>
            state.map((cycle) => {
            if (cycle.id == activeCycleId) {
                return { ...cycle, interruptedDate: new Date()}   
            } else {
                return cycle
            }
            }),
        )
        setActiveCycleId(null)
    }


    const task = watch('task')  // Com isso consigo saber se o input vai ou não estar vazio || transforma o componente em um controled || monitoramento
    return (
      <CyclesContext.Provider value={{activeCycle, activeCycleId, markCurrentCycleAsFinished}}>  
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <NewCycleForm/>
                <CountDown/>

                

                { activeCycle ? (
                    <StopCountDownButton onClick={handleInterruptCycle}  type="button">
                    <HandPalm size={24}/>
                    Interromper
                    </StopCountDownButton>
                ): (                
                    <StartCountDownButton disabled={!task} type="submit">
                    <Play size={24}/>
                    Começar
                    </StartCountDownButton>
                )}

            </form>

        </HomeContainer>
      </CyclesContext.Provider>  
    )
}
