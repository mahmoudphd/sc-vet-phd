import DashboardHeader from '@/components/DashboardHeader';
import PharmaSidebar from '@/components/Sidebar';
import { Box, Flex } from '@radix-ui/themes';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import ActiveBatches from './ActiveBatches';
import AuditTrailViewer from './AuditTrailViewer';
import BatchCosting from './BatchCosting';
import BatchRecords from './BatchRecords';
import CMOs from './CMOs';
import CO2Footprint from './CO2Footprint';
import ColdChainMonitoring from './ColdChainMonitoring';
import CorrectiveActions from './CorrectiveActions';
// import CostAnalysis from './CostAnalysis';
import CostAnalytics from './CostAnalytics';
import DepreciationTracking from './DepreciationTracking';
import DeviationManagement from './DeviationManagement';
import Distributors from './Distributors';
import EndCustomers from './EndCustomers';
import EquipmentMaintenance from './EquipmentMaintenance';
import FinishedGoodsInventory from './FinishedGoodsInventory';
import MaterialQualification from './MaterialQualification';
import PersonnelQualification from './PersonnelQualification';
import PharmacyPartners from './PharmacyPartners';
import PreferencesPage from './PreferencesPage';
import PreventiveMaintenance from './PreventiveMaintenance';
import ProductionOrders from './ProductionOrders';
import ProfilePage from './ProfilePage';
import QualityAuditors from './QualityAuditors';
import ReleaseApprovals from './ReleaseApprovals';
import SalesTrends from './SalesTrends';
import SecurityPage from './SecurityPage';

import FinishedMaterialInventory from './FinishedMaterialInventory';
import FinishedPackagingInventory from './FinishedPackagingInventory';

import ProductConfiguration from './ProductConfiguration'
import { Toaster } from 'sonner'
import ComponentSpecification from './ComponentSpecification';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import LanguageSelector from '@/components/LanguageSelector';

import { useWindowSize } from 'react-use';
import ScrapProducts from './ScrapProducts';
import EmployeeManagement from './EmployeeManagement';
import SupplierManagement from './SupplierManagement';

const App = () => {
    const { i18n } = useTranslation();

    const { height } = useWindowSize();

    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    useEffect(() => {
        document.documentElement.lang = i18n.language;
        document.documentElement.dir = i18n.dir(i18n.language)
    }, [i18n.language]);


    // if (!walletAddress) {
    //     return <Login walletAddress={walletAddress} setWalletAddress={setWalletAddress} />
    // }


    return (
        <BrowserRouter>
            <Flex direction="column" className="bg-stone-50" style={{ height }}>
                <div className="flex-1 overflow-hidden">
                    <Flex>
                        <PharmaSidebar />
                        <Box className="flex-1 flex flex-col h-full bg-stone-50 overflow-y-auto" style={{ height }}>
                            <DashboardHeader />
                            <Box className="flex-auto">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/scrap-products" element={<ScrapProducts />} />
                                    <Route path="/active-batches" element={<ActiveBatches />} />
                                    <Route path="/production-orders" element={<ProductionOrders />} />
                                    <Route path="/batch-records" element={<BatchRecords />} />
                                    <Route path="/cold-chain-monitoring" element={<ColdChainMonitoring />} />

                                    {/* Quality Management Routes */}
                                    <Route path="/audit-trail" element={<AuditTrailViewer />} />
                                    <Route path="/corrective-actions" element={<CorrectiveActions />} />
                                    <Route path="/deviation-management" element={<DeviationManagement />} />
                                    <Route path="/material-qualification" element={<MaterialQualification />} />
                                    <Route path="/release-approvals" element={<ReleaseApprovals />} />

                                    <Route path="/product-configuration" element={<ProductConfiguration />} />
                                    <Route path="/component-specification" element={<ComponentSpecification />} />

                                    {/* Inventory & Supply Chain Routes */}
                                    <Route path="/finished-goods-inventory" element={<FinishedGoodsInventory />} />
                                    <Route path="/finished-material-inventory" element={<FinishedMaterialInventory />} />
                                    <Route path="/finished-packaging-inventory" element={<FinishedPackagingInventory />} />
                                    <Route path="/distributors" element={<Distributors />} />
                                    <Route path="/end-customers" element={<EndCustomers />} />
                                    <Route path="/pharmacy-partners" element={<PharmacyPartners />} />
                                    {/* <Route path="/cmos" element={<CMOs />} /> */}
                                    <Route path="/employee-management" element={<EmployeeManagement />} />
                                    <Route path="/supplier-management" element={<SupplierManagement />} />


                                    {/* Financial Routes */}
                                    <Route path="/batch-costing" element={<BatchCosting />} />
                                    <Route path="/cost-analytics" element={<CostAnalytics />} />
                                    <Route path="/depreciation-tracking" element={<DepreciationTracking />} />
                                    <Route path="/sales-trends" element={<SalesTrends />} />

                                    {/* Maintenance Routes */}
                                    <Route path="/equipment-maintenance" element={<EquipmentMaintenance />} />
                                    <Route path="/preventive-maintenance" element={<PreventiveMaintenance />} />

                                    {/* Sustainability Routes */}
                                    <Route path="/co2-footprint" element={<CO2Footprint />} />

                                    {/* User Management Routes */}
                                    {/* <Route path="/user-management" element={<UserManagement />} /> */}
                                    <Route path="/profile" element={<ProfilePage />} />
                                    <Route path="/security" element={<SecurityPage />} />
                                    <Route path="/preferences" element={<PreferencesPage />} />

                                    {/* Quality Assurance Routes */}
                                    <Route path="/personnel-qualification" element={<PersonnelQualification />} />
                                    <Route path="/quality-auditors" element={<QualityAuditors />} />

                                    {/* Catch-all for undefined routes */}
                                    <Route path="*" element={<div>404 Page Not Found</div>} />
                                </Routes>
                            </Box>
                            <Flex px="6" py="2" align="center" justify="between" gap="2">
                                <div className="text-xs text-black/90">
                                    Verified by VetChain • Led by <strong>PhD. Mahmoud ElDeeb</strong>
                                </div>
                                <div>
                                    <LanguageSelector />
                                </div>
                            </Flex>
                        </Box>
                    </Flex>
                </div>
            </Flex>
            <Toaster />
        </BrowserRouter>
    );
}

export default App
