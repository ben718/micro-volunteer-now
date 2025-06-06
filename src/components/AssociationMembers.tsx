import { useState } from 'react';
import { useAssociationMembers } from '@/hooks/useAssociationMembers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { UserPlus, Trash2, Mail, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export const AssociationMembers = () => {
  const { members, loading, error, inviteMember, updateMemberRole, resendInvitation, removeMember } = useAssociationMembers();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const currentUserId = supabase.auth.user()?.id;

  const handleSendInvitation = async () => {
    if (!inviteEmail || !inviteRole) {
        toast({ title: "Erreur", description: "Veuillez entrer un email et sélectionner un rôle.", variant: "destructive" });
        return;
    }
    setIsInviting(true);
    const success = await inviteMember(inviteEmail, inviteRole);
    if (success) {
      setInviteEmail('');
      setInviteRole('');
      setIsInviteDialogOpen(false);
      toast({ title: "Invitation envoyée", description: `Invitation envoyée à ${inviteEmail}.` });
    } else {
       toast({ title: "Erreur", description: error || "Une erreur est survenue lors de l'envoi de l'invitation.", variant: "destructive" });
    }
    setIsInviting(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir retirer ce membre de l'équipe ?")) {
      setIsRemoving(true);
      const success = await removeMember(memberId);
      if (success) {
        toast({ title: "Membre retiré", description: "Le membre a été retiré de l'équipe." });
      } else {
        toast({ title: "Erreur", description: error || "Une erreur est survenue lors du retrait du membre.", variant: "destructive" });
      }
      setIsRemoving(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
      setIsUpdatingRole(true);
      const success = await updateMemberRole(memberId, newRole);
      if (success) {
          toast({ title: "Rôle mis à jour", description: "Le rôle du membre a été modifié." });
      } else {
          toast({ title: "Erreur", description: error || "Une erreur est survenue lors de la mise à jour du rôle.", variant: "destructive" });
      }
      setIsUpdatingRole(false);
  };

   const handleResendInvitation = async (memberId: string, email: string) => {
       setIsResending(true);
       const success = await resendInvitation(memberId);
       if (success) {
           toast({ title: "Invitation renvoyée", description: `Une nouvelle invitation a été envoyée à ${email}.` });
       } else {
           toast({ title: "Erreur", description: error || "Une erreur est survenue lors du renvoi de l'invitation.", variant: "destructive" });
       }
       setIsResending(false);
   };

  if (loading) return <div>Chargement des membres...</div>;
  if (error && !error.includes("est déjà membre ou invité")) return <div>Erreur lors du chargement des membres : {error}</div>;

  const availableRoles = ['admin', 'manager', 'member'];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des membres de l'équipe</h1>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Inviter un membre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inviter un nouveau membre</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Rôle</Label>
                 <Select onValueChange={setInviteRole} value={inviteRole}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map(role => (
                        <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && error.includes("est déjà membre ou invité") && (
                <div className="text-red-500 text-sm">{error}</div>
            )}
            <DialogFooter>
              <Button onClick={handleSendInvitation} disabled={isInviting || !inviteEmail || !inviteRole}>
                {isInviting ? 'Envoi...' : 'Envoyer l\'invitation'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membres de l'équipe ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-muted-foreground">Aucun membre dans l'équipe.</p>
          ) : (
            <div className="space-y-4">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {member.status === 'active' && member.user?.avatar_url ? (
                       <img
                         src={member.user.avatar_url}
                         alt={`${member.user.first_name} ${member.user.last_name}`}
                         className="w-10 h-10 rounded-full"
                       />
                    ) : (member.status === 'active' ? (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                           {member.user?.first_name?.[0]}{member.user?.last_name?.[0]}
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                           <Mail className="w-5 h-5" />
                        </div>
                    ))}
                    <div>
                      <p className="font-medium">
                        {member.status === 'active' ?
                         `${member.user?.first_name} ${member.user?.last_name}` :
                         member.email
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Statut: {member.status === 'invited' ? 'Invité' : member.status === 'active' ? 'Actif' : 'Inactif'}
                        {member.role && `, Rôle: ${member.role.charAt(0).toUpperCase() + member.role.slice(1)}`}
                      </p>
                       {member.invitation_sent_at && member.status === 'invited' && (
                         <p className="text-xs text-muted-foreground">
                           Invitation envoyée le {format(new Date(member.invitation_sent_at), 'dd/MM/yyyy', { locale: fr })}
                         </p>
                       )}
                       {member.status === 'active' && member.invitation_accepted_at && (
                          <p className="text-xs text-muted-foreground">
                            Accepté le {format(new Date(member.invitation_accepted_at), 'dd/MM/yyyy', { locale: fr })}
                          </p>
                       )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.status === 'active' && currentUserId !== member.user_id && (
                        <Select onValueChange={(value) => handleRoleChange(member.id, value)} value={member.role}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Changer rôle" />
                          </SelectTrigger>
                          <SelectContent>
                             {availableRoles.map(role => (
                                 <SelectItem key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</SelectItem>
                             ))}
                          </SelectContent>
                        </Select>
                    )}

                    {member.status === 'invited' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendInvitation(member.id, member.email)}
                            disabled={isResending}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    )}

                    {currentUserId !== member.user_id && (
                       <Button
                         variant="outline"
                         size="sm"
                         className="text-destructive"
                         onClick={() => handleRemoveMember(member.id)}
                         disabled={isRemoving}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 