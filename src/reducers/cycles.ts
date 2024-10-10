
export interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

interface CyclesState {
    cycles: Cycle[]
    activeCycleId: string | null

}

export enum ActionTypes {
    ADICIONA_NOVO_CICLO = 'ADICIONA_NOVO_CICLO',
    INTERROMPE_CICLO_ATIVO = 'INTERROMPE_CICLO_ATIVO',
    MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED'

}

export function cycleReducer(state: CyclesState, action: any) {
        
    /* O reducer serve para diminuir a complexidade de um useState por exemplo, 
    no lugar da função set diferente do useState temos o dispatch. e os parametros da
    função reducer são primeiro o estado "state" e depois uma action que pode fazer qualquer 
    ação no estado */

    switch(action.type) {
        case ActionTypes.ADICIONA_NOVO_CICLO:
            return {
                ...state,
                cycles: [...state.cycles, action.payload.newCycle],
                activeCycleId: action.payload.newCycle.id,
            }

        case ActionTypes.INTERROMPE_CICLO_ATIVO:
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

        case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED:
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
}