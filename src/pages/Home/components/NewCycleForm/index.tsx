import { useForm } from "react-hook-form";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import * as zod from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";


const newCycleFormValidationSchema = zod.object({     // Validação do campo
    task: zod.string().min(1,'Informe a tarefa'),  // Tem que ser uma string com no mínimo 1 caractere
    minutesAmount: zod.number().min(5).max(60),   // tem que ser um número minimo 5 max 60
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>


export function NewCycleForm() {
    const {register, handleSubmit, watch, reset} = useForm<NewCycleFormData>({  // register -> retorna todas as funções de um input || watch -> permite assistir(acompanhar) algo
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    })  
    return (
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
    )
}