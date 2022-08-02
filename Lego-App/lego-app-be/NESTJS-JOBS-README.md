# (Đã xong) mỗi topic dùng mỗi image khác nhau, vì là mối quan hệ relation 1-1
# (Đã xong) Hiển thị 4 cái topics nhiều người chọn nhất, chưa xong vì cần phải CRUD thêm image topic (Đã xong vì fe sẽ hardcode hình ảnh)
    - Dùng querybuilder:
        async findFeatureTopics(
            params: FindManyTopicDtoClient,
        ) {
            const { lang } = params;
        
            const queryBuilder = await this.userToTopicsRepository
            .createQueryBuilder('userToTopics')
            .leftJoinAndSelect(
                'userToTopics.topic', 'topic',
            )
            .leftJoinAndSelect(
                'topic.translates', 'topicTranslation',
                lang && 'topicTranslation.lang = :lang',
                {
                    lang,
                },
            )
            .select('userToTopics.topicKey, topicTranslation.name')
            .groupBy('userToTopics.topicKey, topicTranslation.name')
            .limit(4)
            .orderBy('COUNT(userToTopics.topicKey)', 'DESC')
            .getRawMany()

            return queryBuilder;
        } 
# (Đã xong) TH3: Muốn xóa topic thì phải xóa từng audio (TH1: Xóa Topic -> Xóa luôn các audio, TH2: Xóa Topic -> Không xóa audio):

# (Đã xong) Tạo Audio:
    + (Chưa xong) Test softDelete: Tạo 1 cái fake Audio qua swagger: localhost:5000/api/* -> /audio
    + (Chưa xong) Muốn tạo 1 Audio phải tạo 1 File
        + Muốn tạo 1 File phải Post qua localhost:5000/api/file/presigned-url (để lấy fileId)
            {
                "type": "mp3"
            }
        + Sau đó Post qua https://s3.ap-northeast-1.amazonaws.com/clevertube-s3-dev1-bucket các fields (để đăng ký trên amazon)
        + Post image qua localhost:5000/api/file/presigned-url (để lấy audioThumbnailId)
            {
                "type": "png"
            }
    + topic.service:
        async remove(key: string) {
            const topicToDelete = await this.topicRepository.findOne(key);
            if (!topicToDelete) {
                throw new NotFoundException(`Topic not found !`);
            }

            const audiosToTopics = await this.audiosToTopicsRepository.findOne({topicKey: key})
            if (audiosToTopics) {
                throw new ConflictException(`The audio is linked to this topic`)
            }

            const videosToTopics = await this.videosToTopicRepository.findOne({ topicKey: key })
            if (videosToTopics) {
                throw new ConflictException(`The video is linked to this topic`)
            }

            return await Promise.all([
                this.topicRepository.softDelete({ key: key, deletedAt: IsNull() }),
                this.topicTransRepo.softDelete({ topicKey: key, deletedAt: IsNull() }),
            ]);
        }
    + audio.service:
        async deleteAudios(data: DeleteAudiosReqDto) {
            const { ids } = data;
            const [resultFist] = await Promise.all([
                this.audioRepository.softDelete(ids),
                this.audioThumbnailRepository.softDelete({
                    audioId: In(ids),
                    deletedAt: IsNull(),
                }),
                this.audioTranscriptRepository.softDelete({
                    audioId: In(ids),
                    deletedAt: IsNull(),
                }),
                this.audiosToTopicsRepository.softDelete({ 
                    audioId: In(ids), 
                    deletedAt: IsNull() 
                }),
            ]);
            if (!resultFist.affected) {
            throw new NotFoundExc('Audio');
            }
        }
# (Đã xong) Thêm deleteAt vào audioToTopic để softDelete
# (Chưa xong) Test CASL
# (Đã xong) Lỗi pagination của Audio không hiện đủ limit 10 mà tính 10 theo audioToTopicsId (Sửa queryBuilder)
    - async getAudioList(data: GetAudioListReqDto, baseRoute: string) {
        const { page, search, limit, topicKey, levelKey } = data;
        // TODO: Load level and topic relation
        const queryBuilder = this.audioRepository
        .createQueryBuilder('audios')
        .select('audios.id')
        .groupBy('audios.id')
        
        let route = baseRoute;
        if (search) {
        queryBuilder.andWhere('audio_code ILIKE :search', {
            search: `%${search}%`,
        });
        route += `?search=${search}`;
        }

        if (topicKey) {
        queryBuilder.andWhere('audiosToTopics.topicKey = :topicKey', {
            topicKey,
        });
        route += `?topicKey=${topicKey}`;
        }

        if (levelKey) {
        queryBuilder.andWhere('audios.levelKey = :levelKey', {
            levelKey,
        });
        route += `?levelKey=${levelKey}`;
        }

        const result = await paginate<Audio>(queryBuilder, {
        page,
        limit,
        route,
        });
        
        return new Pagination<Audio>(
        await Promise.all(
            result.items.map(async (audiosHasId) => {
            const audio = await this.audioRepository
                .createQueryBuilder('audios')
                .leftJoinAndSelect('audios.audioThumbnail', 'audioThumbnail')
                .leftJoinAndSelect('audios.audiosToTopics', 'audiosToTopics')
                .leftJoinAndSelect('audiosToTopics.topic', 'topic')
                .leftJoinAndSelect('topic.translates', 'topicTranslations')
                .leftJoinAndSelect('audios.level', 'level')
                .leftJoinAndSelect('level.translates', 'levelTranslations')
                .where('audios.id = :id', { id: audiosHasId.id })
                .getOne();
            return audio;
            }),
        ),
        result.meta,
        result.links,
        );
    }