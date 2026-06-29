import SalesDashboardLayout from "@/components/sales/layout/SalesDashboardLayout";

export default function Layout({ children }) {

    return (
        <SalesDashboardLayout>
            {children}
        </SalesDashboardLayout>
    );

}