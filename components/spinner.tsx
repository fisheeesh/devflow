import { ReloadIcon } from '@radix-ui/react-icons'

export default function Spinner({ label }: { label: string }) {
    return (
        <>
            <ReloadIcon className='m-2 size-4 animate-spin' />
            <span>{label}</span>
        </>
    )
}
