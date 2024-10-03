import { Play } from "phosphor-react";
import { CountDownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountDownButton, TaskInput } from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod'
import { useState } from "react";


const newCycleFormValidationSchema = zod.object({     // Validação do campo
    task: zod.string().min(1,'Informe a tarefa'),  // Tem que ser uma string com no mínimo 1 caractere
    minutesAmount: zod.number().min(5).max(60),   // tem que ser um número minimo 5 max 60
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

// esse tipo aqui acima serve para substituir uma interface. Ele pega a tipagem da task e do minutesAmount por eu já ter declarado
// no newCycleFormValidationSchema por meio do schema que é a validação em si

interface Cycle {
    id: string
    task: string
    minutesAmount: number
}

export function Home(){

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    
    const {register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({  // register -> retorna todas as funções de um input || watch -> permite assistir(acompanhar) algo
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        

        }
    })  



    function handleCreateNewCycle(data: NewCycleFormData){
        const id = String(new Date().getTime())
        
        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
        }
        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        reset()

    }

    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

    const task = watch('task')  // Com isso consigo saber se o input vai ou não estar vazio || transforma o componente em um controled || monitoramento
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        id="task" 
                        placeholder="Dê um nome para o seu projeto"
                        list="task-suggestions"
                        {...register('task')}
    
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1"/>
                        <option value="Projeto 2"/>
                        <option value="Projeto 3"/>
                        <option value="Projeto 4"/>
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        {...register('minutesAmount', {valueAsNumber: true})}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountDownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountDownContainer>

                <StartCountDownButton disabled={!task} type="submit">
                    <Play size={24}/>
                    Começar
                </StartCountDownButton>

            </form>

        </HomeContainer>
    )
}