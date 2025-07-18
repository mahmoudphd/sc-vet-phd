import { useState } from 'react';
import {
  Card,
  Flex,
  Heading,
  Table,
  Badge,
  Button,
  Grid,
  Text,
  Box,
  Dialog,
} from '@radix-ui/themes';
import * as Select from '@radix-ui/react-select';
import { useTranslation } from 'react-i18next';

const stockOptions = ['optimal', 'low', 'critical'] as const;
type StockOption = typeof stockOptions[number];

interface Pharmacy {
  id: string;
  name: string;
  location: string;
  license: 'Active' | 'Inactive';
  lastDelivery: string;
  stock: StockOption;
  recallCompliance: number;
}

const PharmacyPartners = () => {
  const { t, i18n } = useTranslation();
  const [isStockMonitorOpen, setIsStockMonitorOpen] = useState(false);
  const [isRecallPortalOpen, setIsRecallPortalOpen] = useState(false);

  const getLocationName = (): string => {
    return i18n.language.startsWith('ar') ? 'مصر' : 'Egypt';
  };

  const [pharmacies, setPharmacies] = useState
