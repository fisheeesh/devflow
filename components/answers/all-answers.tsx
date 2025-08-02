import { ActionResponse, Answer } from "@/types/global";
import DataRender from "../data-render";
import { EMPTY_ANSWERS } from "@/constants/states";
import AnswerCard from "../cards/answer-card";
import CommonFilter from "../filters/common-filter";
import { AnswerFilters } from "@/constants/filter";
import Pagination from "../pagination";

interface Props extends ActionResponse<Answer[]> {
    totalAnswers: number,
    page: number,
    isNext: boolean
}

export default function AllAnswers({ data, success, error, totalAnswers, page, isNext }: Props) {
    return (
        <div className="mt-10">
            <div className="flex items-center justify-between relative z-10 mb-6">
                <h3 className="primary-text-gradient">{totalAnswers} Answer{totalAnswers > 1 && 's'}</h3>
                <CommonFilter
                    filters={AnswerFilters}
                    otherClasses="sm:min-w-32"
                />
            </div>

            <div className="relative z-0">
                <DataRender
                    data={data}
                    error={error}
                    success={success}
                    empty={EMPTY_ANSWERS}
                    render={(answers) => answers.map(answer => <AnswerCard key={answer._id} {...answer} />)}
                />
            </div>

            {!!data?.length && <Pagination
                page={page}
                isNext={isNext || false}
            />}

        </div>
    )
}