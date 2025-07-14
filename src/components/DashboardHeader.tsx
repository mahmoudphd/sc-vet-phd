import { useTranslation, Trans } from 'react-i18next';
import {
    Flex,
    Text,
    Badge,
    IconButton,
    Box,
    DropdownMenu
} from '@radix-ui/themes';
import {
    GlobeIcon,
    PersonIcon,
    BellIcon,
    LockClosedIcon,
    DashboardIcon,
    ExitIcon
} from '@radix-ui/react-icons';

const DashboardHeader = () => {
    const { t } = useTranslation('dashboard-header');

    return (
        <Flex justify="end" align="center" p="0" py="4" className="w-full">
            <Flex align="center" gap="4" px="6">
                <Badge color="green" variant="soft" className="px-2 py-1">
                    <GlobeIcon className="w-3.5 h-3.5 mr-1.5" />
                    <span className="text-xs font-medium">
                        {t('dashboard-header:mainnet-live')}
                    </span>
                </Badge>

                <IconButton variant="ghost" className="text-gray-500 hover:text-indigo-600">
                    <BellIcon className="w-4 h-4" />
                </IconButton>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center cursor-pointer border border-indigo-50 hover:border-indigo-100 transition-colors">
                            <PersonIcon className="w-4 h-4 text-indigo-600" />
                        </div>
                    </DropdownMenu.Trigger>
                    
                    <DropdownMenu.Content align="end" className="min-w-[200px]">
                        <DropdownMenu.Item className="text-sm">
                            <PersonIcon className="mr-2" />
                            {t('dashboard-header:profile')}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="text-sm">
                            <LockClosedIcon className="mr-2" />
                            {t('dashboard-header:security')}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="text-sm">
                            <DashboardIcon className="mr-2" />
                            {t('dashboard-header:preferences')}
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item color="red" className="text-sm">
                            <ExitIcon className="mr-2" />
                            {t('dashboard-header:logout')}
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Flex>
        </Flex>
    );
};

export default DashboardHeader;