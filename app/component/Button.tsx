type ButtonProps={
    label: string, 
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void,
}

export function Button({ label, onClick }:ButtonProps){
    return (
        <>
            <button onClick={onClick}>
                {label}
            </button>
        </>
    )
}

