import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountDownButton, StopCountDownButton } from "./styles";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod'
import { useContext } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { CountDown } from "./components/Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";


const newCycleFormValidationSchema = zod.object({     // Validação do campo
    task: zod.string().min(1,'Informe a tarefa'),  // Tem que ser uma string com no mínimo 1 caractere
    minutesAmount: zod.number().min(5).max(60),   // tem que ser um número minimo 5 max 60
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home(){
    const { createNewCycle, interruptCurrentCycle, activeCycle} = useContext(CyclesContext)


    const newCycleForm = useForm<NewCycleFormData>({  // register -> retorna todas as funções de um input || watch -> permite assistir(acompanhar) algo
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })  

    const { handleSubmit, watch, /*reset*/} = newCycleForm


    const task = watch('task')  // Com isso consigo saber se o input vai ou não estar vazio || transforma o componente em um controled || monitoramento
    return (
       <HomeContainer>
            <form onSubmit={handleSubmit(createNewCycle)} action="">
                
                <FormProvider {...newCycleForm}>
                    <NewCycleForm/>
                </FormProvider>
                <CountDown/>

                

                { activeCycle ? (
                    <StopCountDownButton onClick={interruptCurrentCycle}  type="button">
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
      
    )
}
