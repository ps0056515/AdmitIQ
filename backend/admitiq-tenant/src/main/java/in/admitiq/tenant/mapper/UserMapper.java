package in.admitiq.tenant.mapper;

import in.admitiq.domain.model.User;
import in.admitiq.tenant.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toDomain(UserEntity entity);
    UserEntity toEntity(User domain);
}
