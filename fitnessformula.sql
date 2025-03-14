PGDMP      1    	            }            FitnessFormula    17.2    17.2 D    w           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            x           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            y           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            z           1262    16646    FitnessFormula    DATABASE     �   CREATE DATABASE "FitnessFormula" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1251';
     DROP DATABASE "FitnessFormula";
                     postgres    false            �            1259    16749    Reviews    TABLE     7  CREATE TABLE public."Reviews" (
    "ReviewId" integer NOT NULL,
    "TrainerId" integer,
    "UserId" integer,
    "Rating" integer,
    "Comment" text,
    "ReviewDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK ((("Rating" >= 1) AND ("Rating" <= 5)))
);
    DROP TABLE public."Reviews";
       public         heap r       postgres    false            �            1259    16693    Skills    TABLE     r   CREATE TABLE public."Skills" (
    "SkillId" integer NOT NULL,
    "SkillName" character varying(100) NOT NULL
);
    DROP TABLE public."Skills";
       public         heap r       postgres    false            �            1259    16701    TrainerSkills    TABLE     j   CREATE TABLE public."TrainerSkills" (
    "TrainerId" integer NOT NULL,
    "SkillId" integer NOT NULL
);
 #   DROP TABLE public."TrainerSkills";
       public         heap r       postgres    false            �            1259    16678    Trainers    TABLE     �   CREATE TABLE public."Trainers" (
    "TrainerId" integer NOT NULL,
    "Description" text,
    "ExperienceYears" integer,
    "UserId" integer,
    CONSTRAINT trainers_experienceyears_check CHECK (("ExperienceYears" >= 0))
);
    DROP TABLE public."Trainers";
       public         heap r       postgres    false            �            1259    16660    UserSessions    TABLE       CREATE TABLE public."UserSessions" (
    "SessionId" integer NOT NULL,
    "UserId" integer,
    "Token" text NOT NULL,
    "CreatedAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "ExpiresAt" timestamp without time zone,
    "IsActive" boolean DEFAULT true
);
 "   DROP TABLE public."UserSessions";
       public         heap r       postgres    false            �            1259    16648    Users    TABLE     H  CREATE TABLE public."Users" (
    "UserId" integer NOT NULL,
    "FullName" character varying(255) NOT NULL,
    "Email" character varying(255) NOT NULL,
    "PhoneNumber" character varying(20),
    "PasswordHash" text NOT NULL,
    "Avatar" text,
    "RegistrationDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public."Users";
       public         heap r       postgres    false            �            1259    16731    WorkoutRegistrations    TABLE     �   CREATE TABLE public."WorkoutRegistrations" (
    "RegistrationId" integer NOT NULL,
    "WorkoutId" integer,
    "UserId" integer,
    "RegistrationDate" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 *   DROP TABLE public."WorkoutRegistrations";
       public         heap r       postgres    false            �            1259    16717    Workouts    TABLE     	  CREATE TABLE public."Workouts" (
    "WorkoutId" integer NOT NULL,
    "Title" character varying(255) NOT NULL,
    "Description" text NOT NULL,
    "StartTime" timestamp without time zone NOT NULL,
    "TrainerId" integer,
    "ImageUrl" character varying(255)
);
    DROP TABLE public."Workouts";
       public         heap r       postgres    false            �            1259    16748    reviews_reviewid_seq    SEQUENCE     �   CREATE SEQUENCE public.reviews_reviewid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.reviews_reviewid_seq;
       public               postgres    false    231            {           0    0    reviews_reviewid_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.reviews_reviewid_seq OWNED BY public."Reviews"."ReviewId";
          public               postgres    false    230            �            1259    16692    skills_skillid_seq    SEQUENCE     �   CREATE SEQUENCE public.skills_skillid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.skills_skillid_seq;
       public               postgres    false    224            |           0    0    skills_skillid_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.skills_skillid_seq OWNED BY public."Skills"."SkillId";
          public               postgres    false    223            �            1259    16677    trainers_trainerid_seq    SEQUENCE     �   CREATE SEQUENCE public.trainers_trainerid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.trainers_trainerid_seq;
       public               postgres    false    222            }           0    0    trainers_trainerid_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.trainers_trainerid_seq OWNED BY public."Trainers"."TrainerId";
          public               postgres    false    221            �            1259    16647    users_userid_seq    SEQUENCE     �   CREATE SEQUENCE public.users_userid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.users_userid_seq;
       public               postgres    false    218            ~           0    0    users_userid_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.users_userid_seq OWNED BY public."Users"."UserId";
          public               postgres    false    217            �            1259    16659    usersessions_sessionid_seq    SEQUENCE     �   CREATE SEQUENCE public.usersessions_sessionid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.usersessions_sessionid_seq;
       public               postgres    false    220                       0    0    usersessions_sessionid_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.usersessions_sessionid_seq OWNED BY public."UserSessions"."SessionId";
          public               postgres    false    219            �            1259    16730 '   workoutregistrations_registrationid_seq    SEQUENCE     �   CREATE SEQUENCE public.workoutregistrations_registrationid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 >   DROP SEQUENCE public.workoutregistrations_registrationid_seq;
       public               postgres    false    229            �           0    0 '   workoutregistrations_registrationid_seq    SEQUENCE OWNED BY     w   ALTER SEQUENCE public.workoutregistrations_registrationid_seq OWNED BY public."WorkoutRegistrations"."RegistrationId";
          public               postgres    false    228            �            1259    16716    workouts_workoutid_seq    SEQUENCE     �   CREATE SEQUENCE public.workouts_workoutid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.workouts_workoutid_seq;
       public               postgres    false    227            �           0    0    workouts_workoutid_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.workouts_workoutid_seq OWNED BY public."Workouts"."WorkoutId";
          public               postgres    false    226            �           2604    16752    Reviews ReviewId    DEFAULT     x   ALTER TABLE ONLY public."Reviews" ALTER COLUMN "ReviewId" SET DEFAULT nextval('public.reviews_reviewid_seq'::regclass);
 C   ALTER TABLE public."Reviews" ALTER COLUMN "ReviewId" DROP DEFAULT;
       public               postgres    false    231    230    231            �           2604    16696    Skills SkillId    DEFAULT     t   ALTER TABLE ONLY public."Skills" ALTER COLUMN "SkillId" SET DEFAULT nextval('public.skills_skillid_seq'::regclass);
 A   ALTER TABLE public."Skills" ALTER COLUMN "SkillId" DROP DEFAULT;
       public               postgres    false    223    224    224            �           2604    16681    Trainers TrainerId    DEFAULT     |   ALTER TABLE ONLY public."Trainers" ALTER COLUMN "TrainerId" SET DEFAULT nextval('public.trainers_trainerid_seq'::regclass);
 E   ALTER TABLE public."Trainers" ALTER COLUMN "TrainerId" DROP DEFAULT;
       public               postgres    false    222    221    222            �           2604    16663    UserSessions SessionId    DEFAULT     �   ALTER TABLE ONLY public."UserSessions" ALTER COLUMN "SessionId" SET DEFAULT nextval('public.usersessions_sessionid_seq'::regclass);
 I   ALTER TABLE public."UserSessions" ALTER COLUMN "SessionId" DROP DEFAULT;
       public               postgres    false    220    219    220            �           2604    16651    Users UserId    DEFAULT     p   ALTER TABLE ONLY public."Users" ALTER COLUMN "UserId" SET DEFAULT nextval('public.users_userid_seq'::regclass);
 ?   ALTER TABLE public."Users" ALTER COLUMN "UserId" DROP DEFAULT;
       public               postgres    false    218    217    218            �           2604    16734 #   WorkoutRegistrations RegistrationId    DEFAULT     �   ALTER TABLE ONLY public."WorkoutRegistrations" ALTER COLUMN "RegistrationId" SET DEFAULT nextval('public.workoutregistrations_registrationid_seq'::regclass);
 V   ALTER TABLE public."WorkoutRegistrations" ALTER COLUMN "RegistrationId" DROP DEFAULT;
       public               postgres    false    228    229    229            �           2604    16720    Workouts WorkoutId    DEFAULT     |   ALTER TABLE ONLY public."Workouts" ALTER COLUMN "WorkoutId" SET DEFAULT nextval('public.workouts_workoutid_seq'::regclass);
 E   ALTER TABLE public."Workouts" ALTER COLUMN "WorkoutId" DROP DEFAULT;
       public               postgres    false    226    227    227            t          0    16749    Reviews 
   TABLE DATA                 public               postgres    false    231   �S       m          0    16693    Skills 
   TABLE DATA                 public               postgres    false    224   lU       n          0    16701    TrainerSkills 
   TABLE DATA                 public               postgres    false    225   \V       k          0    16678    Trainers 
   TABLE DATA                 public               postgres    false    222   �V       i          0    16660    UserSessions 
   TABLE DATA                 public               postgres    false    220   ]X       g          0    16648    Users 
   TABLE DATA                 public               postgres    false    218   �X       r          0    16731    WorkoutRegistrations 
   TABLE DATA                 public               postgres    false    229   ?\       p          0    16717    Workouts 
   TABLE DATA                 public               postgres    false    227   �\       �           0    0    reviews_reviewid_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.reviews_reviewid_seq', 2, true);
          public               postgres    false    230            �           0    0    skills_skillid_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.skills_skillid_seq', 3, true);
          public               postgres    false    223            �           0    0    trainers_trainerid_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.trainers_trainerid_seq', 2, true);
          public               postgres    false    221            �           0    0    users_userid_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.users_userid_seq', 3, true);
          public               postgres    false    217            �           0    0    usersessions_sessionid_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.usersessions_sessionid_seq', 1, true);
          public               postgres    false    219            �           0    0 '   workoutregistrations_registrationid_seq    SEQUENCE SET     U   SELECT pg_catalog.setval('public.workoutregistrations_registrationid_seq', 4, true);
          public               postgres    false    228            �           0    0    workouts_workoutid_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.workouts_workoutid_seq', 3, true);
          public               postgres    false    226            �           2606    16758    Reviews reviews_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT reviews_pkey PRIMARY KEY ("ReviewId");
 @   ALTER TABLE ONLY public."Reviews" DROP CONSTRAINT reviews_pkey;
       public                 postgres    false    231            �           2606    16698    Skills skills_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public."Skills"
    ADD CONSTRAINT skills_pkey PRIMARY KEY ("SkillId");
 >   ALTER TABLE ONLY public."Skills" DROP CONSTRAINT skills_pkey;
       public                 postgres    false    224            �           2606    16700    Skills skills_skillname_key 
   CONSTRAINT     _   ALTER TABLE ONLY public."Skills"
    ADD CONSTRAINT skills_skillname_key UNIQUE ("SkillName");
 G   ALTER TABLE ONLY public."Skills" DROP CONSTRAINT skills_skillname_key;
       public                 postgres    false    224            �           2606    16686    Trainers trainers_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public."Trainers"
    ADD CONSTRAINT trainers_pkey PRIMARY KEY ("TrainerId");
 B   ALTER TABLE ONLY public."Trainers" DROP CONSTRAINT trainers_pkey;
       public                 postgres    false    222            �           2606    16705     TrainerSkills trainerskills_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public."TrainerSkills"
    ADD CONSTRAINT trainerskills_pkey PRIMARY KEY ("TrainerId", "SkillId");
 L   ALTER TABLE ONLY public."TrainerSkills" DROP CONSTRAINT trainerskills_pkey;
       public                 postgres    false    225    225            �           2606    16658    Users users_email_key 
   CONSTRAINT     U   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT users_email_key UNIQUE ("Email");
 A   ALTER TABLE ONLY public."Users" DROP CONSTRAINT users_email_key;
       public                 postgres    false    218            �           2606    16656    Users users_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT users_pkey PRIMARY KEY ("UserId");
 <   ALTER TABLE ONLY public."Users" DROP CONSTRAINT users_pkey;
       public                 postgres    false    218            �           2606    16669    UserSessions usersessions_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public."UserSessions"
    ADD CONSTRAINT usersessions_pkey PRIMARY KEY ("SessionId");
 J   ALTER TABLE ONLY public."UserSessions" DROP CONSTRAINT usersessions_pkey;
       public                 postgres    false    220            �           2606    16671 #   UserSessions usersessions_token_key 
   CONSTRAINT     c   ALTER TABLE ONLY public."UserSessions"
    ADD CONSTRAINT usersessions_token_key UNIQUE ("Token");
 O   ALTER TABLE ONLY public."UserSessions" DROP CONSTRAINT usersessions_token_key;
       public                 postgres    false    220            �           2606    16737 .   WorkoutRegistrations workoutregistrations_pkey 
   CONSTRAINT     |   ALTER TABLE ONLY public."WorkoutRegistrations"
    ADD CONSTRAINT workoutregistrations_pkey PRIMARY KEY ("RegistrationId");
 Z   ALTER TABLE ONLY public."WorkoutRegistrations" DROP CONSTRAINT workoutregistrations_pkey;
       public                 postgres    false    229            �           2606    16724    Workouts workouts_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public."Workouts"
    ADD CONSTRAINT workouts_pkey PRIMARY KEY ("WorkoutId");
 B   ALTER TABLE ONLY public."Workouts" DROP CONSTRAINT workouts_pkey;
       public                 postgres    false    227            �           2606    16759    Reviews reviews_trainerid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT reviews_trainerid_fkey FOREIGN KEY ("TrainerId") REFERENCES public."Trainers"("TrainerId") ON DELETE CASCADE;
 J   ALTER TABLE ONLY public."Reviews" DROP CONSTRAINT reviews_trainerid_fkey;
       public               postgres    false    231    222    4799            �           2606    16764    Reviews reviews_userid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Reviews"
    ADD CONSTRAINT reviews_userid_fkey FOREIGN KEY ("UserId") REFERENCES public."Users"("UserId") ON DELETE CASCADE;
 G   ALTER TABLE ONLY public."Reviews" DROP CONSTRAINT reviews_userid_fkey;
       public               postgres    false    4793    231    218            �           2606    16687    Trainers trainers_userid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Trainers"
    ADD CONSTRAINT trainers_userid_fkey FOREIGN KEY ("UserId") REFERENCES public."Users"("UserId") ON DELETE CASCADE;
 I   ALTER TABLE ONLY public."Trainers" DROP CONSTRAINT trainers_userid_fkey;
       public               postgres    false    4793    218    222            �           2606    16711 (   TrainerSkills trainerskills_skillid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."TrainerSkills"
    ADD CONSTRAINT trainerskills_skillid_fkey FOREIGN KEY ("SkillId") REFERENCES public."Skills"("SkillId") ON DELETE CASCADE;
 T   ALTER TABLE ONLY public."TrainerSkills" DROP CONSTRAINT trainerskills_skillid_fkey;
       public               postgres    false    224    225    4801            �           2606    16706 *   TrainerSkills trainerskills_trainerid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."TrainerSkills"
    ADD CONSTRAINT trainerskills_trainerid_fkey FOREIGN KEY ("TrainerId") REFERENCES public."Trainers"("TrainerId") ON DELETE CASCADE;
 V   ALTER TABLE ONLY public."TrainerSkills" DROP CONSTRAINT trainerskills_trainerid_fkey;
       public               postgres    false    4799    225    222            �           2606    16672 %   UserSessions usersessions_userid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UserSessions"
    ADD CONSTRAINT usersessions_userid_fkey FOREIGN KEY ("UserId") REFERENCES public."Users"("UserId") ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public."UserSessions" DROP CONSTRAINT usersessions_userid_fkey;
       public               postgres    false    4793    218    220            �           2606    16743 5   WorkoutRegistrations workoutregistrations_userid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."WorkoutRegistrations"
    ADD CONSTRAINT workoutregistrations_userid_fkey FOREIGN KEY ("UserId") REFERENCES public."Users"("UserId") ON DELETE CASCADE;
 a   ALTER TABLE ONLY public."WorkoutRegistrations" DROP CONSTRAINT workoutregistrations_userid_fkey;
       public               postgres    false    218    4793    229            �           2606    16738 8   WorkoutRegistrations workoutregistrations_workoutid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."WorkoutRegistrations"
    ADD CONSTRAINT workoutregistrations_workoutid_fkey FOREIGN KEY ("WorkoutId") REFERENCES public."Workouts"("WorkoutId") ON DELETE CASCADE;
 d   ALTER TABLE ONLY public."WorkoutRegistrations" DROP CONSTRAINT workoutregistrations_workoutid_fkey;
       public               postgres    false    229    227    4807            �           2606    16725     Workouts workouts_trainerid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Workouts"
    ADD CONSTRAINT workouts_trainerid_fkey FOREIGN KEY ("TrainerId") REFERENCES public."Trainers"("TrainerId") ON DELETE SET NULL;
 L   ALTER TABLE ONLY public."Workouts" DROP CONSTRAINT workouts_trainerid_fkey;
       public               postgres    false    222    4799    227            t   �  x����JQ��<�h�5�ً�XYXD��(�� j���B")��F���DWVݬ�0�|�9���L؜9s2���������
UVigo}{k�4�����y�;Jk��s�4�,B8��J�̱>�.��E:�5����L��O�ʎ%���/Hw�b3��T�u�Tğ9��O�΄3Iʭ(��KӶ땧��3��_�C>O�.��CB�C�t�"�����6 Q֞��(�5?�$�运|����
��8��}#_L|� /'�碑Ot�]1�g�I��/�-�@G}�V�(!�#�4�c���)>�^� ����z����p��q�,B����%}
EcNrJb;���9��k�Q�~���|��<e���xnz��y�\��O��,!%�k[�5%��9@wx�i�������Q&�1��Q'�&^p[��f��^Dt5�䰜�����)wm�\�7?�z�i�V��D�.o��!
oپ9      m   �   x���v
Q���W((M��L�S
����)VRs�	uV�0�QP�0�bÅ}����M��\�D�5�ya߅�6���g�v�m��}a���&��[/�Z� ����b�37�k��Fb�����;a�Ŧ[��iv<Ľ@�h�����m	s�V�ǁn:��M@���@�<<=C4.L��4@t�G@����q�&�*.. H.�      n   x   x���v
Q���W((M��L�S
)J��K-
����)VRs�	uV�0�Q0Դ��$I�1i:�t�H�a��`F��0#��K�t���@�� ��@��i�$9�t́Z�� _P��      k   i  x����J�@��y���*�bj�(�<�P�
�z�� "�MR��� �ޅ�6��i|��7�ЋKX6ٝ���f��鶎z�����18�Uz������B'�ǭ.mx.U��SIę���F\r�S^�J&� �p�����\�$!�)��Vu�w���s�V캲_�(DF��3���ęd��)ԥ@H�R��* �`i	��J��Un�J��^\H�c;ÚI��o[Û
����G�ސ9�D&rK*��1�D��d��J5}@���\jX���P2��A��π�bߚ���'3cӞ�w����`�N�U��A��֤]%��?�HQ�u^�j� 5�^cr�����>�o����L.��      i   �   x�Uʱ�0��OqaAJz�R'���o 1j������'��v����v�^k��S���1��GL`<����3��dz�X���4�-H�b�e@��L��)*�"I�j}���K��쟖�ԏj��{YyB| -&�      g   9  x���]k�P��}� �)�으��L�ڂl���gk��&m��u����+�E�C�Z�\Yݛ_��yN��t'��HOI������<�P|\��s�y�i�X�*���w�[��Z\��[���p�q�|���f5gmdZ�j˦7U � �"����u�� �{�rk�.�����{�gN��	@���0-(P*��Q�ԩ�'��V
T����p����)ۑ�§6���ʲ�(��J�����ߤ"���j�����l=i�|�l����$��kO*ƒ[4�Nyf��ڮ�nw��R�Z�-�����Q��(��n�Aec	̏�S.Q/@��5Q��[�>�}|���0�f&Y�&O_m�3kl"۱��<�|Y�3�.�e�B���W��=�#c0ޤ΄�\�m�D�R��JRW��2Õ�r��m�����&�����H����Tb��(żJ�*���5�m�>��4
�e�I�f��fe*Q���i�X�2Z!�V���{�a�o	v��~�j�n�6}��7�[M��2"fN���h�Aüh}�$�'�?��ﴜ�hjԴ4�+uF	�*!��^�a0��~O����я���&�A�i�Fz�*��z���e1�s��"���	s��~:a�?���7��E��1f�5� U��9��[��W�=��L�{ޣ�7͆�#�&ୌ	֩7�1�D�A���Ŵ���p@�1R��0���I���1|ёF++�1�ń[d�JnwTr�69/vi�}"��2�a��~���:�:��4L4d*�8v�O�h�p�� '���-�n+Ff�cZ&�2�F�mb�/���W      r   �   x���v
Q���W((M��L�S
�/��/-	JM�,.)J,���+VRs�	uV�0�Q "#u##S]#]#3Cc+C+c=KcsuMk.O�M6kH��u�ic�	�d��02�21�2�г�403���� v�a      p   V  x���MoQ�����nФ�|Hiu墉�L,�um*�C���҆�Fw�Pk�S�X
���{���9C������so�}�{�s�����9��#��y����^xZ��*�T�z� ���F��EJ�#�S5R��C�]S����+/��~��I�I7եI�0���u[�� Ӟ���`��4�hV&e�)�$Ӹg��0#��l��;n����X}�~�]L޾�pn��Ű_p|,�T�s����Q��$��:��;�2�:��-8����W8����)X�ޕ���m���z2�~����ꉸa����gf^�e��&s9J��J�u�����3�����ȈA ����|
��Uԙ�@��G�I�3dPN��"⧋�	�����z.w���˪��M��#�$�o�^ ���a�/x3������@�|�wi%�k;�9kx�x��O�CmքV#q�QK�M���fF.{ڻq�Z�$�+�[S�=�G������-8Y|����]���>�ź2n-�ӽ��;
�bۗ����SQ��MH\>A7C�2����i`���S���ǴA�������a��l�e�?7Y     