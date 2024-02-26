"use client"
import React, { useContext, useState } from 'react';

const TestContext = React.createContext<{referer: null|string, setReferer: (test: string|null) => void}>({
    referer: null,
    setReferer: (_: string|null) => {}
});

interface Props {
    children: React.ReactElement;
    initReferer?: string|null;
}

export const TestProvider = (props: Props) => {

    const [referer, setReferer] = useState<string|null>(props?.initReferer ?? null);

    return (
        <TestContext.Provider value={{referer, setReferer}}>
            {props.children}
        </TestContext.Provider>
    )

}

export const useTestContent = () => useContext(TestContext);