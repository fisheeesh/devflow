import { ActionResponse, Answer } from "@/types/global";
import DataRender from "../data-render";
import { EMPTY_ANSWERS } from "@/constants/states";
import AnswerCard from "../cards/answer-card";
import CommonFilter from "../filters/common-filter";
import { AnswerFilters } from "@/constants/filter";

interface Props extends ActionResponse<Answer[]> {
    totalAnswers: number
}

export default function AllAnswers({ data, success, error, totalAnswers }: Props) {
    return (
        <div className="mt-11">
            <div className="flex items-center justify-between">
                <h3 className="primary-text-gradient">{totalAnswers} Answer{totalAnswers > 1 && 's'}</h3>
                <CommonFilter
                    filters={AnswerFilters}
                    otherClasses="sm:min-w-32"
                />
            </div>

            <DataRender
                data={data}
                error={error}
                success={success}
                empty={EMPTY_ANSWERS}
                render={(answers) => answers.map(answer => <AnswerCard key={answer._id} {...answer} />)}
            />
        </div>
    )
}
