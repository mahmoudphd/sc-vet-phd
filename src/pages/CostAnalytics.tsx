import {
  Card,
  Flex,
  Heading,
  Text,
  Table,
  Badge,
  Button,
  Grid,
  Progress,
  Select,
  Box
} from '@radix-ui/themes';
import { PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

const solutionOptions = [
  'Negotiating better prices with supplier',
  'Reducing waste in material usage',
  'Automation to reduce manual labor costs',
  'Optimizing machine usage',
  'Improving inventory management',
  'Minimize transportation costs',
  'Reduce rework costs',
  'Other'
];

const initialCostData = [
  { category: 'Raw Materials', actual: 1200000, target: 1100000, percent: 40, color: '#3b82f6' },
  { category: 'Direct Labor', actual: 600000, target: 580000, percent: 20, color: '#10b981' },
  { category: 'Packaging Materials', actual: 450000, target: 420000, percent: 15, color: '#f59e0b' },
  { category: 'Overhead', actual: 300000, target: 280000, percent: 15, color: '#a855f7' },
  { category: 'Other Costs', actual: 2
