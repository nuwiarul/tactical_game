import {type FC} from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";

export interface IBreadcum {
    title: string;
    href: string;
    icon?: FC<{ className?: string }>;
}

interface AppBreadcumProps {
    breadcums: IBreadcum[];
}

const AppBreadcum = ({breadcums}: AppBreadcumProps) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcums.map((breadcum: IBreadcum) => (
                    <span key={breadcum.title} className="flex items-center gap-3">
                        <BreadcrumbItem>
                            {breadcum.href !== "" && breadcum.href !== "#" ? (
                                <BreadcrumbLink href={breadcum.href} className="flex items-center gap-1">
                                    {breadcum.icon && (
                                        <breadcum.icon className="w-5 h-5"/>
                                    )}
                                    {breadcum.title}
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage className="flex items-center gap-1">
                                    {breadcum.icon && (
                                        <breadcum.icon className="w-5 h-5"/>
                                    )}
                                    {breadcum.title}
                                </BreadcrumbPage>
                            )}

                        </BreadcrumbItem>
                        {breadcum.href !== "" && breadcum.href !== "#" && (
                            <BreadcrumbSeparator/>
                        )}
                    </span>

                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default AppBreadcum;