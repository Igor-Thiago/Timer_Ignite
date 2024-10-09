import { useContext, useEffect } from "react";
import { CountDownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../../../../contexts/CyclesContext";


export function CountDown() {
    const {activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed} = useContext(CyclesContext)

    
    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0


    useEffect(() => {
        let interval: number
        if(activeCycle) {
         interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(new Date(),
                activeCycle.startDate,
            )

            if (secondsDifference >= totalSeconds) {
                markCurrentCycleAsFinished()
                setSecondsPassed(totalSeconds)
                clearInterval(interval)
            } else {
                setSecondsPassed( secondsDifference )
            }              
          }, 1000);
        }


        return () => {           // Serve para limpar o que eu estava fazendo no useEfect anterior (Ele roda toda vez q a variavel muda)
            clearInterval(interval)
        }

    }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished, setSecondsPassed]) // como estou usando essa variável de fora obrigatoriamente tenho que botar ela como parâmetro do useEfect

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

    return (      
        <CountDownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountDownContainer>
    )
}