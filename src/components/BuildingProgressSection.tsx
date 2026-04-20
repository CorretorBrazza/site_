'use client';

import { Calendar } from 'lucide-react';

interface BuildingProgressSectionProps {
    progressPercentage: number;
    lastUpdateDate: string;
    stages?: Array<{
        name: string;
        percentage: number;
        completed: boolean;
    }>;
}

export default function BuildingProgressSection({
    progressPercentage,
    lastUpdateDate,
    stages = []
}: BuildingProgressSectionProps) {
    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Calendar className="text-white" size={24} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Andamento da Obra</h2>
                </div>

                <p className="text-gray-600 mb-8 text-lg">
                    Confira as etapas atualizadas do andamento da obra do empreendimento
                </p>

                {/* Last Update */}
                <div className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">Última atualização:</span> {lastUpdateDate}
                    </p>
                </div>

                {/* Main Progress Bar */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">Progresso Geral</h3>
                        <span className="text-2xl font-bold text-blue-600">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-6 overflow-hidden shadow-md">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-3"
                            style={{ width: `${Math.max(5, progressPercentage)}%` }}
                        >
                            {progressPercentage > 15 && (
                                <span className="text-white text-sm font-bold drop-shadow">
                                    {progressPercentage}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stages */}
                {stages.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stages.map((stage, index) => (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    stage.completed
                                        ? 'bg-green-50 border-green-500 shadow-md'
                                        : 'bg-white border-gray-200'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-sm">{stage.name}</p>
                                        <p className="text-sm text-gray-600 mt-1">{stage.percentage}%</p>
                                    </div>
                                    {stage.completed && (
                                        <div className="flex-shrink-0">
                                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-full rounded-full transition-all ${
                                            stage.completed ? 'bg-green-500' : 'bg-blue-500'
                                        }`}
                                        style={{ width: `${stage.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
