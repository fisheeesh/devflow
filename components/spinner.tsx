import { ReloadIcon } from '@radix-ui/react-icons'

interface SpinnerProps {
    isLoading: boolean,
    label: string,
    children: React.ReactNode
}

export default function Spinner({ isLoading, label, children }: SpinnerProps) {
    return (
        <>
            {
                isLoading ? <>
                    <ReloadIcon className='m-2 size-4 animate-spin' />
                    <span>{label}</span>
                </> : children
            }
        </>
    )
}
