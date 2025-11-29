import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Alert,
    Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../config/api';
import { useTheme } from '../context/ThemeContext';
import Skeleton from '../components/Skeleton';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../styles/theme';

const { width } = Dimensions.get('window');

const AnalyticsScreen = () => {
    const [utilization, setUtilization] = useState(null);
    const [peakHours, setPeakHours] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { colors } = useTheme();

    const fetchData = useCallback(async () => {
        try {
            const [utilizationRes, peakHoursRes] = await Promise.all([
                api.get('/analytics/utilization'),
                api.get('/analytics/peak-hours')
            ]);
            setUtilization(utilizationRes.data);
            setPeakHours(peakHoursRes.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch analytics data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const getUtilizationColor = (percentage) => {
        if (percentage < 50) return colors.free;
        if (percentage < 80) return colors.warning;
        return colors.occupied;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
                contentContainerStyle={styles.content}
            >
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text }]}>Analytics</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Real-time parking insights</Text>
                </View>

                {loading ? (
                    <View>
                        <Skeleton height={200} style={{ marginBottom: SPACING.xl }} />
                        <View style={{ flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.xl }}>
                            <Skeleton style={{ flex: 1 }} height={100} />
                            <Skeleton style={{ flex: 1 }} height={100} />
                            <Skeleton style={{ flex: 1 }} height={100} />
                        </View>
                        <Skeleton height={30} width={150} style={{ marginBottom: SPACING.md }} />
                        <Skeleton height={80} style={{ marginBottom: SPACING.md }} />
                        <Skeleton height={80} style={{ marginBottom: SPACING.xl }} />
                        <Skeleton height={30} width={120} style={{ marginBottom: SPACING.md }} />
                        <Skeleton height={150} />
                    </View>
                ) : utilization ? (
                    <>
                        <View style={[styles.utilizationCard, SHADOWS.card, { backgroundColor: colors.card }]}>
                            <View style={styles.utilizationHeader}>
                                <Text style={[styles.utilizationLabel, { color: colors.text }]}>Current Utilization</Text>
                                <View style={[
                                    styles.utilizationBadge,
                                    { backgroundColor: getUtilizationColor(utilization.utilization) + '20' }
                                ]}>
                                    <Text style={[
                                        styles.utilizationBadgeText,
                                        { color: getUtilizationColor(utilization.utilization) }
                                    ]}>
                                        {utilization.utilization < 50 ? 'Low' : utilization.utilization < 80 ? 'Moderate' : 'High'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.circularProgressContainer}>
                                <Text style={[
                                    styles.utilizationValue,
                                    { color: getUtilizationColor(utilization.utilization) }
                                ]}>
                                    {utilization.utilization.toFixed(1)}%
                                </Text>
                            </View>
                            <View style={[styles.progressBarContainer, { backgroundColor: colors.surface }]}>
                                <View
                                    style={[
                                        styles.progressBar,
                                        {
                                            width: `${utilization.utilization}%`,
                                            backgroundColor: getUtilizationColor(utilization.utilization)
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                        <View style={styles.statsGrid}>
                            <View style={[styles.statCard, SHADOWS.sm, { backgroundColor: colors.card }]}>
                                <View style={[styles.iconBox, { backgroundColor: colors.primary + '20' }]}>
                                    <MaterialCommunityIcons name="parking" size={24} color={colors.primary} />
                                </View>
                                <Text style={[styles.statValue, { color: colors.text }]}>{utilization.totalSlots}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Slots</Text>
                            </View>

                            <View style={[styles.statCard, SHADOWS.sm, { backgroundColor: colors.card }]}>
                                <View style={[styles.iconBox, { backgroundColor: colors.occupied + '20' }]}>
                                    <MaterialCommunityIcons name="car" size={24} color={colors.occupied} />
                                </View>
                                <Text style={[styles.statValue, { color: colors.text }]}>{utilization.occupiedSlots}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Occupied</Text>
                            </View>

                            <View style={[styles.statCard, SHADOWS.sm, { backgroundColor: colors.card }]}>
                                <View style={[styles.iconBox, { backgroundColor: colors.free + '20' }]}>
                                    <MaterialCommunityIcons name="check-circle" size={24} color={colors.free} />
                                </View>
                                <Text style={[styles.statValue, { color: colors.text }]}>{utilization.freeSlots}</Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Available</Text>
                            </View>
                        </View>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Insights</Text>
                        <View style={styles.insightsContainer}>
                            <View style={[styles.insightCard, SHADOWS.sm, { backgroundColor: colors.card }]}>
                                <MaterialCommunityIcons
                                    name={utilization.utilization < 50 ? "check-decagram" : "alert-circle"}
                                    size={24}
                                    color={utilization.utilization < 50 ? colors.free : colors.warning}
                                />
                                <Text style={[styles.insightText, { color: colors.text }]}>
                                    {utilization.utilization < 50
                                        ? 'Parking availability is good. Easy to find spots.'
                                        : utilization.utilization < 80
                                            ? 'Parking is getting busy. Limited spots available.'
                                            : 'Parking is nearly full. Finding a spot might be hard.'}
                                </Text>
                            </View>

                            <View style={[styles.insightCard, SHADOWS.sm, { backgroundColor: colors.card }]}>
                                <MaterialCommunityIcons name="information" size={24} color={colors.primary} />
                                <Text style={[styles.insightText, { color: colors.text }]}>
                                    {utilization.freeSlots > 0
                                        ? `${utilization.freeSlots} slot${utilization.freeSlots > 1 ? 's' : ''} currently available for visitors.`
                                        : 'No slots currently available. Check back later.'}
                                </Text>
                            </View>
                        </View>

                        {peakHours && peakHours.hasData && (
                            <>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Peak Hours</Text>
                                <View style={[styles.peakHoursCard, SHADOWS.sm, { backgroundColor: colors.card }]}>
                                    <View style={styles.peakHoursHeader}>
                                        <MaterialCommunityIcons name="clock-time-four" size={20} color={colors.primary} />
                                        <Text style={[styles.peakHoursSubtitle, { color: colors.textSecondary }]}>
                                            Based on {peakHours.analysisPeriod} of activity
                                        </Text>
                                    </View>
                                    {peakHours.peakHours.map((peak, index) => (
                                        <View key={peak.hour} style={styles.peakHourItem}>
                                            <View style={styles.peakHourLeft}>
                                                <View style={[
                                                    styles.peakHourRank,
                                                    { backgroundColor: index === 0 ? colors.primary : colors.surface }
                                                ]}>
                                                    <Text style={[
                                                        styles.peakHourRankText,
                                                        { color: index === 0 ? '#FFFFFF' : colors.text }
                                                    ]}>
                                                        {index + 1}
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text style={[styles.peakHourTime, { color: colors.text }]}>
                                                        {peak.time}
                                                    </Text>
                                                    <Text style={[styles.peakHourActivity, { color: colors.textSecondary }]}>
                                                        {peak.activity} activities
                                                    </Text>
                                                </View>
                                            </View>
                                            <MaterialCommunityIcons
                                                name="trending-up"
                                                size={20}
                                                color={index === 0 ? colors.primary : colors.textSecondary}
                                            />
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="chart-bar-stacked" size={64} color={colors.textSecondary} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No analytics data available</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: SPACING.lg,
    },
    header: {
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: TYPOGRAPHY.sizes.xxl,
        fontWeight: TYPOGRAPHY.weights.bold,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: TYPOGRAPHY.sizes.md,
    },
    utilizationCard: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        marginBottom: SPACING.xl,
    },
    utilizationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    utilizationLabel: {
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: TYPOGRAPHY.weights.semibold,
    },
    utilizationBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
    },
    utilizationBadgeText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: TYPOGRAPHY.weights.bold,
    },
    circularProgressContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    utilizationValue: {
        fontSize: 48,
        fontWeight: TYPOGRAPHY.weights.bold,
    },
    progressBarContainer: {
        width: '100%',
        height: 8,
        borderRadius: BORDER_RADIUS.full,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: BORDER_RADIUS.full,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
        gap: SPACING.md,
    },
    statCard: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    statValue: {
        fontSize: TYPOGRAPHY.sizes.xl,
        fontWeight: TYPOGRAPHY.weights.bold,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: TYPOGRAPHY.sizes.xs,
        fontWeight: TYPOGRAPHY.weights.medium,
    },
    sectionTitle: {
        fontSize: TYPOGRAPHY.sizes.lg,
        fontWeight: TYPOGRAPHY.weights.bold,
        marginBottom: SPACING.md,
    },
    insightsContainer: {
        gap: SPACING.md,
    },
    insightCard: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    insightText: {
        flex: 1,
        fontSize: TYPOGRAPHY.sizes.sm,
        lineHeight: 20,
    },
    peakHoursCard: {
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.xl,
    },
    peakHoursHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginBottom: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    peakHoursSubtitle: {
        fontSize: TYPOGRAPHY.sizes.xs,
        marginLeft: SPACING.xs,
    },
    peakHourItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    },
    peakHourLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    peakHourRank: {
        width: 32,
        height: 32,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    peakHourRankText: {
        fontSize: TYPOGRAPHY.sizes.sm,
        fontWeight: TYPOGRAPHY.weights.bold,
    },
    peakHourTime: {
        fontSize: TYPOGRAPHY.sizes.md,
        fontWeight: TYPOGRAPHY.weights.semibold,
        marginBottom: 2,
    },
    peakHourActivity: {
        fontSize: TYPOGRAPHY.sizes.xs,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: SPACING.xxl,
    },
    emptyText: {
        marginTop: SPACING.md,
        fontSize: TYPOGRAPHY.sizes.md,
    },
});

export default AnalyticsScreen;
