import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAnalytics } from '../services/analytics';

export default function AnalyticsScreen() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [timeFrame, setTimeFrame] = useState('week');

    useEffect(() => {
        loadAnalytics();
    }, [timeFrame]);

    const loadAnalytics = async () => {
        try {
            const data = await getAnalytics(timeFrame);
            setAnalytics(data);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadAnalytics();
    };

    const renderStatCard = (title, value, icon, trend) => (
        <View style={styles.statCard}>
            <View style={styles.statHeader}>
                <Ionicons name={icon} size={24} color="#007AFF" />
                <Text style={styles.statTitle}>{title}</Text>
            </View>
            <Text style={styles.statValue}>{value}</Text>
            {trend && (
                <View style={[
                    styles.trendContainer,
                    { backgroundColor: trend > 0 ? '#E8FFF3' : '#FFE8E8' }
                ]}>
                    <Ionicons
                        name={trend > 0 ? 'trending-up' : 'trending-down'}
                        size={16}
                        color={trend > 0 ? '#34C759' : '#FF3B30'}
                    />
                    <Text style={[
                        styles.trendText,
                        { color: trend > 0 ? '#34C759' : '#FF3B30' }
                    ]}>
                        {Math.abs(trend)}%
                    </Text>
                </View>
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.statsGrid}>
                {renderStatCard(
                    'Total Sales', 
                    `₹${analytics?.totalSales || 0}`, 
                    'cash-outline', 
                    analytics?.salesTrend
                )}
                {renderStatCard(
                    'Active Listings', 
                    analytics?.activeListings || 0, 
                    'list-outline', 
                    analytics?.listingsTrend
                )}
                {renderStatCard(
                    'Views', 
                    analytics?.totalViews || 0, 
                    'eye-outline', 
                    analytics?.viewsTrend
                )}
                {renderStatCard(
                    'Messages', 
                    analytics?.totalMessages || 0, 
                    'chatbubbles-outline', 
                    analytics?.messagesTrend
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                {/* Add recent activity list here */}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: 'white',
        width: '48%',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statTitle: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    trendText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    section: {
        backgroundColor: 'white',
        margin: 10,
        padding: 15,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
    },
}); 