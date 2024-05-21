import React, { useEffect, useState } from 'react';
import { Button, Input, Select } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SelectOptions } from '../interfaces/AddNewUserForms';
import { useFetchWithAccessToken } from '@/functions/useFetchWithAccessToken';
import { BackendApiUrl } from '@/functions/BackendApiUrl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { mutate } from 'swr';

interface Props {
    questionTypeOptions: SelectOptions<number>[];
    id: string;
    question: string;
    questionType: number;
    addOptions: string[];
}

interface AddOption {
    option: string;
}

interface AddQuestion {
    questionTemplateId: number;
    question: string;
    questionType: number;
    addOptions: AddOption[];
}

const questionSchema = z.object({
    question: z.string({ required_error: 'Question can\'t be empty' }).min(1, 'Question can\'t be empty'),
    questionType: z.number({ required_error: 'Type answer can\'t be empty' }).min(1, 'Type answwer can\'t be empty'),
})

const QuestionForm: React.FC<Props> = ({ questionTypeOptions, id, question, questionType, addOptions }) => {
    const router = useRouter();
    const masterQuestionId = router.query['masterQuestionId'];
    const { fetchPOST, fetchPUT } = useFetchWithAccessToken();

    const { control, formState: { errors }, handleSubmit, reset, setValue } = useForm<AddQuestion>({
        resolver: zodResolver(questionSchema),
    });

    const [answerOptions, setAnswerOptions] = useState<string[]>([]);

    const onSubmit = async (formData: AddQuestion) => {

        if(id == ""){
            const payload = {
                questionTemplateId: masterQuestionId,
                question: formData.question,
                questionType: formData.questionType,
                addOptions: answerOptions.map(option => ({ option })),
            };
    
            const response = await fetchPOST<AddQuestion>(BackendApiUrl.createQuestion, payload);
            if (response.data) {
                reset();
                setAnswerOptions([]);
            }
        }else{
            const payload = {
                Id: id,
                question: formData.question,
                questionType: formData.questionType,
                addOptions: answerOptions.map(option => ({ option })),
            };
    
            const response = await fetchPUT<AddQuestion>(BackendApiUrl.updateQuestion, payload);
            if (response.data) {
                mutate(BackendApiUrl.getQuestionList);
                reset();
                setAnswerOptions([]);
            }
        }
    };

    const onCancel = () => {
        reset();
    }

    const handleAddOption = () => {
        const optionValue = document.getElementById('answerOptionInput') as HTMLInputElement;
        if (optionValue.value.trim() !== '') {
            setAnswerOptions([...answerOptions, optionValue.value.trim()]);
            optionValue.value = '';
        }
    };

    const handleRemoveOption = (index: number) => {
        const updatedOptions = answerOptions.filter((_, i) => i !== index);
        setAnswerOptions(updatedOptions);
    };

    useEffect(() => {
        if (id) {
            setValue('question', question);
            setValue('questionType', questionType);
            setAnswerOptions(addOptions)
        }
    }, [id, question, questionType, addOptions, setValue])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='items-center flex mb-2'>
                <p className='font-bold w-1/5'>Question</p>
                <div className='w-4/5'>
                    <Controller
                        name="question"
                        control={control}
                        render={({ field }) => (
                            <Input
                                className={`border-2 rounded mt-3 p-3.5`}
                                {...field}
                            />
                        )}
                    />
                    {errors.question && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.question?.message}</p>
                    )}
                </div>
            </div>

            <div className='items-center flex'>
                <p className='font-bold w-1/5'>Type Answer</p>
                <div className='w-4/5'>
                    <Controller
                        name="questionType"
                        control={control}
                        render={({ field }) => (
                            <Select
                                className={`mt-3 w-full custom-select h-100 bg-white`}
                                size={"large"}
                                bordered={false}
                                options={questionTypeOptions}
                                {...field}
                            />
                        )}
                    />
                    {errors.questionType && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.questionType?.message}</p>
                    )}
                </div>
            </div>

            <div className='items-center flex mb-12' style={{ marginBottom: 90 }}>
                <p className='font-bold w-1/5'>Answer Option</p>
                <div className='w-4/5'>
                    <div className='flex flex-row'>
                        <Input
                            id="answerOptionInput"
                            className={`border-2 rounded mt-3 p-3.5 w-5/6`}
                        />
                        <div className='border rounded-md mt-3 ml-3 border-[#3788FD] w-1/6 items-center flex justify-center cursor-pointer' onClick={handleAddOption}>
                            <FontAwesomeIcon icon={faPlus} color='#3788FD'></FontAwesomeIcon>
                            <p className='text-center align-middle ml-3 font-semibold' style={{ color: '#3788FD' }}>Add Option</p>
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        {answerOptions.map((option, index) => (
                            <>
                                <p key={index} className="border rounded-md px-5 py-2 mr-3 font-semibold border-[#3788FD] text-md mt-1.5" style={{ color: '#3788FD' }}>
                                    {option}
                                    <FontAwesomeIcon icon={faClose} color='#3788FD' className='ml-3' onClick={() => handleRemoveOption(index)}></FontAwesomeIcon>
                                </p>
                            </>
                        ))}
                    </div>

                    {errors.addOptions && (
                        <p className="text-md text-red-600 font-normal font-body mt-1.5">{errors.addOptions?.message}</p>
                    )}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-gray-100">
                <hr style={{ margin: '20px 0' }} />
                <div className='flex justify-end px-5 py-3'>
                    <Button type='primary' danger size='large' className='mr-5' onClick={onCancel}>Batal</Button>
                    <button className={`bg-[#3788FD] text-white px-5 py-2 rounded w-[100px]'}`}>Simpan</button>
                </div>
            </div>
        </form>
    );
};

export default QuestionForm;
