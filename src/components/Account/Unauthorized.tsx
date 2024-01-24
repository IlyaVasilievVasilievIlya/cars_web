import { ErrorMessage } from "../ErrorMessage"

export const Unauthorized: React.FC = () => {
    return <ErrorMessage error="youre not allowed to be here"/>
}