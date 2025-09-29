import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {ARRAY_PAGE_SIZE} from "@/utils/constants.ts";

interface DataTablePaginationProps {
    pageNumber: number,
    setPageNumber: (pageNumber: number) => void,
    pageSize: number,
    setPageSize: (pageSize: number) => void,
    totalPage: number,
}

const DataTablePagination = ({pageNumber, setPageNumber, pageSize, setPageSize, totalPage} : DataTablePaginationProps) => {

    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5; // Jumlah maksimal link halaman yang terlihat
        const halfMax = Math.floor(maxPagesToShow / 2);

        // Tampilkan beberapa halaman awal
        if (totalPage <= maxPagesToShow) {
            for (let i = 1; i <= totalPage; i++) {
                pages.push(i);
            }
        } else if (pageNumber <= halfMax + 1) {
            // Jika di dekat awal
            for (let i = 1; i <= maxPagesToShow - 1; i++) {
                pages.push(i);
            }
            pages.push("ellipsis-end");
            pages.push(totalPage);
        } else if (pageNumber >= totalPage - halfMax) {
            // Jika di dekat akhir
            pages.push(1);
            pages.push("ellipsis-start");
            for (let i = totalPage - (maxPagesToShow - 2); i <= totalPage; i++) {
                pages.push(i);
            }
        } else {
            // Jika di tengah
            pages.push(1);
            pages.push("ellipsis-start");
            for (let i = pageNumber - halfMax + 1; i <= pageNumber + halfMax -1; i++) {
                pages.push(i);
            }
            pages.push("ellipsis-end");
            pages.push(totalPage);
        }
        return pages;
    };

    const pages = getPageNumbers();


    return (
        <div className="flex items-center">
            <Select value={`${pageSize}`} onValueChange={(value: string) => {
                setPageNumber(1)
                setPageSize(Number(value))
            }}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    {ARRAY_PAGE_SIZE.map((arr: number) => (
                        <SelectItem value={`${arr}`} key={arr}>{arr}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="ml-auto">
                <Pagination>
                    <PaginationContent>
                        {!(pageNumber <= 1) && (
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setPageNumber(pageNumber - 1)}
                                    className="cursor-pointer"
                                />
                            </PaginationItem>
                        )}

                       {/* {[...Array(totalPage)].map((_, index) => (
                            <PaginationItem key={index + 1}>
                                <PaginationLink
                                    isActive={pageNumber === index + 1}
                                    onClick={() => setPageNumber(index + 1)}
                                >{index + 1}</PaginationLink>
                            </PaginationItem>
                        ))}*/}
                        {pages.length > 1 && pages.map((currentPage, index) => {
                            if (currentPage === "ellipsis-start" || currentPage === "ellipsis-end") {
                                return (
                                    <PaginationItem key={index}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }
                            return (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        isActive={currentPage === pageNumber}
                                        onClick={() => setPageNumber(Number(currentPage))}
                                        className="cursor-pointer"
                                    >
                                        {currentPage}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}


                        {!(pageNumber >= totalPage) && (
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setPageNumber(pageNumber + 1)}
                                    className="cursor-pointer"
                                />
                            </PaginationItem>
                        )}

                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default DataTablePagination;