"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.missionService = void 0;
const supabase_1 = require("../lib/supabase");
exports.missionService = {
    // Récupérer toutes les missions
    getAllMissions() {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase
                .from('missions')
                .select('*')
                .order('date', { ascending: true });
            if (error)
                throw error;
            return data;
        });
    },
    // Récupérer une mission par ID
    getMissionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase
                .from('missions')
                .select('*')
                .eq('id', id)
                .single();
            if (error)
                throw error;
            return data;
        });
    },
    // Créer une nouvelle mission
    createMission(mission) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase
                .from('missions')
                .insert([mission])
                .select()
                .single();
            if (error)
                throw error;
            return data;
        });
    },
    // Mettre à jour une mission
    updateMission(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase
                .from('missions')
                .update(updates)
                .eq('id', id)
                .select()
                .single();
            if (error)
                throw error;
            return data;
        });
    },
    // Supprimer une mission
    deleteMission(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabase_1.supabase
                .from('missions')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
        });
    },
    // S'inscrire à une mission
    registerForMission(missionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase
                .from('mission_registrations')
                .insert([{
                    mission_id: missionId,
                    user_id: userId,
                    status: 'pending'
                }])
                .select()
                .single();
            if (error)
                throw error;
            return data;
        });
    },
    // Annuler une inscription
    cancelRegistration(missionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabase_1.supabase
                .from('mission_registrations')
                .delete()
                .eq('mission_id', missionId)
                .eq('user_id', userId);
            if (error)
                throw error;
        });
    },
    // Récupérer les inscriptions d'un utilisateur
    getUserRegistrations(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase
                .from('mission_registrations')
                .select(`
        *,
        mission:missions(*)
      `)
                .eq('user_id', userId);
            if (error)
                throw error;
            return data;
        });
    }
};
