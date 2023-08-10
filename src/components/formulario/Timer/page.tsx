type PropsType = {
    timer: number,
    porcentagemTimer?: number
}
export default function Timer(props: PropsType) {
    return (
        
        <div className="w-full bg-gray-200 rounded-full dark:bg-blue-200">
            <div className={`bg-blue-600 p-0.5 leading-none rounded-full transition-all duration-1000`} style={{ width: `${props.porcentagemTimer}%` }}/>
        </div>

    )
}