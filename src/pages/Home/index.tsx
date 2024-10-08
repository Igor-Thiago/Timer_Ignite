import { HandPalm, Play } from "phosphor-react";
import { CountDownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountDownButton, StopCountDownButton, TaskInput } from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod'
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";


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
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

export function Home(){

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)


    const {register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({  // register -> retorna todas as funções de um input || watch -> permite assistir(acompanhar) algo
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        

        }
    })  

    const activeCycle = cycles.find((cycle) => cycle.id == activeCycleId)

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

    useEffect(() => {
        let interval: number
        if(activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(new Date(),
                activeCycle.startDate,
            )

            if (secondsDifference >= totalSeconds) {
                setCycles( (state) =>
                    state.map((cycle) => {
                    if (cycle.id == activeCycleId) {
                        return { ...cycle, finishedDate: new Date()}   
                    } else {
                        return cycle
                    }
                    }),
                )
                setAmountSecondsPassed(totalSeconds)
                clearInterval(interval)
            } else {
                setAmountSecondsPassed( secondsDifference )
            }

                
            }, 1000);
        }


        return () => {           // Serve para limpar o que eu estava fazendo no useEfect anterior (Ele roda toda vez q a variavel muda)
            clearInterval(interval)
        }

    }, [activeCycle, totalSeconds, activeCycleId]) // como estou usando essa variável de fora obrigatoriamente tenho que botar ela como parâmetro do useEfect

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

    

    

    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)  // Math.floor arredonda pra baixo o resultado

    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')

    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if(activeCycle){
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

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
                        disabled={!!activeCycle}
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
                        disabled={!!activeCycle}
                        {...register('minutesAmount', {valueAsNumber: true})}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountDownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountDownContainer>

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
    )
}
