import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function PaginationComponent({ currentPage, totalActions, onPageChange }: { currentPage: number; totalActions: number; onPageChange: (page: number) => void }) { 
    const numOfPages = Math.ceil(totalActions / 10);
    const actionsArray = Array.from({ length: numOfPages }, (_, i) => i + 1);
    const handlePrevious = () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    };
    const handleNext = () => {
      if (currentPage < numOfPages) {
        onPageChange(currentPage + 1);
      }
    };
    
  return (
    <Pagination className="my-3">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={(e) => { e.preventDefault(); handlePrevious() }} />
        </PaginationItem>
        {actionsArray.map((action) => (
          <PaginationItem key={action}>
            <PaginationLink className={`${action === currentPage ? 'bg-blue-500 text-white' : ''}`} onClick={(e) => { e.preventDefault(); onPageChange(action); }} isActive={action === currentPage}>{action}</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext onClick={(e) => { e.preventDefault(); handleNext() }} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
